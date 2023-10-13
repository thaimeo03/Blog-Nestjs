import {
  Controller,
  Res,
  Req,
  Get,
  Put,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  Query,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException
} from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from 'src/auth/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { Response, Request } from 'express'
import { FilterUserDto } from './dto/filter-user.dto'
import { PaginateValidationPipe } from 'common/paginateValidation.pipe'
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterConfigService } from 'common/multerConfig'

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failed' })
  findAll(@Query(new PaginateValidationPipe()) query: FilterUserDto) {
    console.log(query)

    return this.userService.findAll(query)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Failed' })
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

  @UseGuards(AuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', new MulterConfigService('avatar').createMulterOptions()))
  uploadAvatar(@Req() req: Request, @Res() res: Response, @UploadedFile() file: Express.Multer.File) {
    if (req['fileValidationError']) {
      throw new BadRequestException(req['fileValidationError'])
    }

    if (!file) {
      throw new BadRequestException('File not found')
    }

    this.userService.updateAvatar({ id: Number(req['user'].userId), avatarUrl: file.path })
    return res.json({ message: 'Avatar updated' })
  }
}
