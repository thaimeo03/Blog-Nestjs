import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Like, Repository } from 'typeorm'
import { UpdateUserDto } from './dto/update-user.dto'
import { FilterUserDto } from './dto/filter-user.dto'
import { ResponseDataWithPagination } from 'common/responseData'

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findAll(query: FilterUserDto) {
    const limit_query = query.limit || 3
    const page_query = query.page || 1
    const search_query = query.search || ''

    const [result, count] = await this.userRepository.findAndCount({
      select: ['id', 'first_name', 'last_name', 'email', 'status', 'created_at', 'updated_at'],
      where: [
        { first_name: Like(`%${search_query}%`) },
        { last_name: Like(`%${search_query}%`) },
        { email: Like(`%${search_query}%`) }
      ],
      order: { created_at: 'DESC' },
      skip: (page_query - 1) * limit_query,
      take: limit_query
    })

    return new ResponseDataWithPagination({
      message: 'Success',
      data: result,
      pagination: {
        current_page: page_query,
        total_page: Math.ceil(count / limit_query)
      }
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
