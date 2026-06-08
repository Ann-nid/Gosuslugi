import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';



@Controller('users')   //слушает все запросы начинающиеся с /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()          //ловит запросы на добавление 
  create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @Get()                //запрос GET /users
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    return this.usersService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

