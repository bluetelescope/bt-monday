import { Injectable } from '@nestjs/common';
import { CreateMondayItemDto } from './dto/create-monday-item.dto';
import { UpdateMondayItemDto } from './dto/update-monday-item.dto';

@Injectable()
export class MondayItemService {
  create(createMondayItemDto: CreateMondayItemDto) {
    return 'This action adds a new mondayItem';
  }

  findAll() {
    return `This action returns all mondayItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mondayItem`;
  }

  update(id: number, updateMondayItemDto: UpdateMondayItemDto) {
    return `This action updates a #${id} mondayItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} mondayItem`;
  }
}
