import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ServiceRequest } from './entities/request.entity';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Body() requestData: Partial<ServiceRequest>) {
    return this.requestsService.create(requestData);
  }

  @Get()
  findAll() {
    return this.requestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(+id);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; comment: any },
  ) {
    return this.requestsService.updateStatus(+id, body.status, body.comment);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
}

