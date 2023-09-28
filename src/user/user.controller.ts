import { Controller, Res, Req, Get, Put, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { Response, Request } from 'express'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id)
  }

  @UseGuards(AuthGuard)
  @Put()
  update(
    // @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    this.userService.update({ id: Number(req['user'].userId), updateUserDto })

    return res.json({ message: 'User updated' })
  }
}
