import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'

interface Pagination {
  page?: string
  limit?: string
}

@Injectable()
export class PaginateValidationPipe implements PipeTransform {
  transform(value: Pagination, metadata: ArgumentMetadata) {
    if (value.limit) {
      if (Number.isNaN(Number(value.limit))) {
        throw new BadRequestException('Limit must be a number')
      }

      if (Number(value.limit) < 1 || Number(value.limit) > 20) {
        throw new BadRequestException('Limit must be between 1 and 20')
      }
    }

    if (value.page) {
      if (Number.isNaN(Number(value.page))) {
        throw new BadRequestException('Page must be a number')
      }

      if (Number(value.page) < 1) {
        throw new BadRequestException('Page must be greater than 0')
      }
    }

    return {
      ...value,
      limit: Number(value.limit),
      page: Number(value.page)
    }
  }
}
