import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerDto: RegisterUserDto) {
    registerDto.password = await this.hashPassword(registerDto.password)
    const user = await this.userRepository.save(registerDto)

    const { access_token, refresh_token } = await this.generateToken({
      userId: user.id,
      email: user.email
    })

    await this.userRepository.update(user.id, { refresh_token })

    return { access_token, refresh_token }
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email
      }
    })

    if (!user) {
      throw new HttpException('Invalid email', HttpStatus.UNAUTHORIZED)
    }

    const checkPassword = bcrypt.compareSync(loginDto.password, user.password)
    if (!checkPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED)
    }

    // Generate refresh token and access token
    const { access_token, refresh_token } = await this.generateToken({
      userId: user.id,
      email: user.email
    })

    // Update refresh token to database
    await this.userRepository.update(user.id, { refresh_token })

    return { access_token, refresh_token }
  }

  async refreshToken(refresh_token: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          refresh_token
        }
      })
      if (!user) {
        throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST)
      }

      const token = await this.generateToken({
        userId: user.id,
        email: user.email
      })

      this.userRepository.update(user.id, { refresh_token: token.refresh_token })
      return token
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST)
    }
  }

  private async generateToken(payload: { userId: number; email: string }) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('SECRET_ACCESS_TOKEN'),
      expiresIn: this.configService.get('EXPIRES_IN_ACCESS_TOKEN')
    })
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('SECRET_REFRESH_TOKEN'),
      expiresIn: this.configService.get('EXPIRES_IN_REFRESH_TOKEN')
    })

    return { access_token, refresh_token }
  }

  private async hashPassword(password: string) {
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const hash = await bcrypt.hash(password, salt)

    return hash
  }
}
