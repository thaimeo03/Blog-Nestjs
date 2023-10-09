import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  first_name: string

  @ApiProperty()
  @IsNotEmpty()
  last_name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2)
  status: number
}
