import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // strips properties not in DTO
      forbidNonWhitelisted: true, // throws error if extra fields
      transform: true, // auto-transform payloads into DTO classes
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
