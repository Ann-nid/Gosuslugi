import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',      // Имя главного администратора БД
      password: '12345',   // Наш новый простой пароль
      database: 'GosuslugiDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      options: {
        encrypt: false,    // Отключаем шифрование для локального запуска
      },
    }),
    UsersModule,
    RequestsModule,
  ],
})
export class AppModule {}

