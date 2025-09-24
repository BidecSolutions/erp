import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductWithVariantsDto } from './dto/create-produt-with-variant.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('create')
  create() {
    return this.productService.create();
  }
@Post('store')
async store(@Body() createProductDto: CreateProductDto) {
  return this.productService.store(createProductDto);
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
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Get('toogleStatus/:id')
  statusChange(@Param('id', ParseIntPipe) id: number) {
    return this.productService.statusUpdate(id);
  }
  // variant 


}
