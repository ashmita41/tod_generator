import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotesModule } from './quotes/quotes.module';
import { DesignModule } from './design/design.module';
import { ImageModule } from './image/image.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    QuotesModule,
    DesignModule,
    ImageModule 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}