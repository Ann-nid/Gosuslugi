import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Включаем CORS для работы с фронтендом
  app.enableCors(); 
  
  await app.listen(3000);
  console.log('Сервер успешно запущен на http://localhost:3000');
}
bootstrap();

