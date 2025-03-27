import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS if needed
  app.enableCors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  });
  
  // Serve static files from the generated-images directory
  app.useStaticAssets(path.join(process.cwd(), 'generated-images'), {
    prefix: '/images',
  });
  
  // Add validation pipe with comprehensive options
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));

  // Add global error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
      statusCode: 500,
      message: err.message || 'Internal server error',
      error: err.stack
    });
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();