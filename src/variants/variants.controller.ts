import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('variants')
@Controller()
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post('products/:productId/variants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a variant for a product' })
  @ApiResponse({ status: 201, description: 'Variant created successfully' })
  @ApiResponse({ status: 409, description: 'Duplicate variant combination' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    return this.variantsService.create(productId, createVariantDto);
  }

  @Get('products/:productId/variants')
  @ApiOperation({ summary: 'Get all variants for a product' })
  @ApiResponse({ status: 200, description: 'List of variants' })
  findAllByProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.variantsService.findAllByProduct(productId);
  }

  @Get('variants/:id')
  @ApiOperation({ summary: 'Get a variant by ID' })
  @ApiResponse({ status: 200, description: 'Variant found' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.variantsService.findOne(id);
  }

  @Patch('variants/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a variant' })
  @ApiResponse({ status: 200, description: 'Variant updated successfully' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  @ApiResponse({ status: 409, description: 'Duplicate variant combination' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.variantsService.update(id, updateVariantDto);
  }

  @Delete('variants/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a variant' })
  @ApiResponse({ status: 204, description: 'Variant deleted successfully' })
  @ApiResponse({ status: 404, description: 'Variant not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.variantsService.remove(id);
  }
}
