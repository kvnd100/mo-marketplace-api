import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { VariantsModule } from './variants/variants.module';

@Module({
  imports: [AuthModule, ProductsModule, VariantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
