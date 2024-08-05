import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MondayItemService } from './monday-item.service';
import { CreateMondayItemDto } from './dto/create-monday-item.dto';
import { UpdateMondayItemDto } from './dto/update-monday-item.dto';

@Controller('monday-item')
export class MondayItemController {
  constructor(private readonly mondayItemService: MondayItemService) {}

  @Post()
  create(@Body() createMondayItemDto: CreateMondayItemDto) {
    return this.mondayItemService.create(createMondayItemDto);
  }

  @Get()
  findAll() {
    return this.mondayItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mondayItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMondayItemDto: UpdateMondayItemDto) {
    return this.mondayItemService.update(+id, updateMondayItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mondayItemService.remove(+id);
  }
}
