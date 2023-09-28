import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  first_name: string

  @IsNotEmpty()
  last_name: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2)
  status: number
}
