import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'first_name', 'last_name', 'email', 'status', 'created_at', 'updated_at']
    })
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: {
        id
      },
      select: ['id', 'first_name', 'last_name', 'email', 'status', 'created_at', 'updated_at']
    })
  }

  async update({ id, updateUserDto }: { id: number; updateUserDto: UpdateUserDto }) {
    await this.userRepository.update(id, updateUserDto)
  }
}
