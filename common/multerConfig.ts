import { Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private folderName: string) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter(req, file, callback) {
        const ext = extname(file.originalname)
        console.log(ext)

        const allowedExtensions = ['.png', '.jpg', '.jpeg']

        if (!allowedExtensions.includes(ext)) {
          req.fileValidationError = 'Only images are allowed. Accepted extensions are png, jpg, jpeg'
          return callback(null, false)
        }

        const fileSize = file.size
        if (fileSize > 5 * 1024 * 1024) {
          req.fileValidationError = 'File is too large. Max file size is 5MB'
          return callback(null, false)
        }

        callback(null, true)
      },
      storage: diskStorage({
        destination: `uploads/${this.folderName}`,
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`)
        }
      })
    }
  }
}
