import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()   //можно "внедрять" в другие файлы (Контроллер)
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, //встроенный инструмент TypeORM, сам генерирует sql-запросы
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();  //первращается в sql-запрос select * from users и возвращает массив граждан
  }

  async findOne(id: number): Promise<User> {   //ищет одного человека
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {   //insert into users... в sql
    const newUser = this.usersRepository.create(userData);
    return await this.usersRepository.save(newUser);
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.findOne(id);   
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); //есть ли такой человек?
    await this.usersRepository.delete(id);
  }
}

