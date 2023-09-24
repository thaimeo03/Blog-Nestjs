import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    console.log(registerDto)
    return this.authService.register(registerDto)
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() loginDto: LoginUserDto) {
    console.log(loginDto)
    return this.authService.login(loginDto)
  }
}
