import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { RegisterUserDto } from './dto/register-user.dto'
import { AuthService } from './auth.service'
import { LoginUserDto } from './dto/login-user.dto'
import { ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Register success' })
  @ApiResponse({ status: 400, description: 'Register failed' })
  register(@Body() registerDto: RegisterUserDto) {
    console.log(registerDto)
    return this.authService.register(registerDto)
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'Login success' })
  @ApiResponse({ status: 401, description: 'Login failed' })
  @UsePipes(ValidationPipe)
  login(@Body() loginDto: LoginUserDto) {
    console.log(loginDto)
    return this.authService.login(loginDto)
  }

  @Post('refresh-token')
  @ApiResponse({ status: 200, description: 'Refresh token success' })
  @ApiResponse({ status: 422, description: 'Refresh token failed' })
  refreshToken(@Body() { refresh_token }: { refresh_token: string }) {
    console.log(refresh_token)
    return this.authService.refreshToken(refresh_token)
  }
}
