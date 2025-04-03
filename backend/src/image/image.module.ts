// src/image/image.module.ts
import { Module } from '@nestjs/common';
import { ImageService } from './services/image.service';
import { ImageController } from './controllers/image.controller';
import { TextUtilsService } from './services/text-utils.service';
import { QuotesModule } from '../quotes/quotes.module';
import { DesignModule } from '../design/design.module';
import { FontLoader } from './utils/font-loader';

@Module({
  imports: [
    QuotesModule,
    DesignModule
  ],
  controllers: [ImageController],
  providers: [
    ImageService, 
    TextUtilsService,
    FontLoader
  ],
  exports: [ImageService]
})
export class ImageModule {}