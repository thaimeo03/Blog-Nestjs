import { Body, Controller, Post } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterUserDto) {
    console.log(registerDto)
    this.authService.register(registerDto)
  }
}
