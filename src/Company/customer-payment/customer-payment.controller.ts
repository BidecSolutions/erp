import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CustomerPaymentService } from './customer-payment.service';
import { CreateCustomerPaymentDto } from './dto/create-customer-payment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('customer-payments')
export class CustomerPaymentController {
  constructor(private readonly paymentService: CustomerPaymentService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/customer-payments',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.match(/\/(pdf|jpeg|jpg|png)$/)
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only PDF, JPEG, JPG, PNG files are allowed!'), false);
        }
      },
    }),
  )
  async create(@Body() dto: CreateCustomerPaymentDto, @UploadedFile() file: Express.Multer.File) {
    const filePath = file ? file.path : '';
    return this.paymentService.create(dto, filePath);
  }

  @Get('findAll')
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('findby/:id')
  findOne(@Param('id') id: number) {
    return this.paymentService.findOne(id);
  }

//   @Put('updateby/:id')
//   update(@Param('id') id: number, @Body() dto: UpdateCustomerPaymentDto) {
//     return this.paymentService.update(id, dto);
//   }

//   @Delete('deleteby/:id')
//   remove(@Param('id') id: number) {
//     return this.paymentService.remove(id);
//   }
}
