import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const photoUploadOptions = {
  storage: diskStorage({
    destination: './uploads/photos',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    if (allowedTypes.test(ext) && allowedTypes.test(mimeType)) {
      callback(null, true);
    } else {
      callback(new BadRequestException('Only JPEG, JPG, PNG images are allowed!'), false);
    }
  },
};
