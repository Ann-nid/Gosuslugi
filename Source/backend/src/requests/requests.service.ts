import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as EntityModule from './entities/request.entity'; 

const EntityClass = Object.values(EntityModule).find((v) => typeof v === 'function') as any;

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(EntityClass)
    private readonly requestsRepository: Repository<any>,
  ) {}

  // Возвращаем стандартный рабочий метод, который гарантированно вернет массив заявок без ошибок базы данных
  async findAll() {
    return this.requestsRepository.find();
  }

  async create(requestData: any) {
    const newRequest = this.requestsRepository.create(requestData);
    return this.requestsRepository.save(newRequest);
  }

  async findOne(id: number) {
    const request = await this.requestsRepository.findOne({ where: { id } as any });
    if (!request) throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    return request;
  }

  async updateStatus(id: number, status: string, comment: string) {
    const request = await this.findOne(id);
    request.status = status;
    request.comment = comment;
    return this.requestsRepository.save(request);
  }

  async remove(id: number) {
    const request = await this.findOne(id);
    return this.requestsRepository.remove(request);
  }
}