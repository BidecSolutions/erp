import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseInterceptors, UploadedFiles, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('create')
  fetch() {
    return this.productService.create();
  }

  @Post('store')
  @UseInterceptors(FilesInterceptor('images'))
  async create(

    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @Req() req:Request,
  ) {
    
    if (body.variants && typeof body.variants === 'string') {
      body.variants = JSON.parse(body.variants);
    }
    const imagePaths = files?.map((file) => `/uploads/products/${file.filename}`) || [];
    const companyId = req["user"].company_id;
    console.log("companyId" ,companyId)
    return this.productService.store(body, imagePaths ,companyId);
  }

  

  @Get('list')
  findAll(@Query('filter') filter?: string) {
    return this.productService.findAll(
      filter !== undefined ? Number(filter) : undefined,
    );
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  // @UseInterceptors(FilesInterceptor('images'))
  // async update(
  //   @Param('id') id: number,
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body() body: any,
  // ) {
  //   if (body.variants && typeof body.variants === 'string') {
  //     body.variants = JSON.parse(body.variants);
  //   }
  //   const imagePaths = files?.map((file) => `/uploads/products/${file.filename}`) || [];
  //   return this.productService.update(+id, body, imagePaths);
  // }
  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.productService.statusUpdate(id);
  }
}
