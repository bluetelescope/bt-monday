import { PartialType } from '@nestjs/mapped-types';
import { CreateMondayItemDto } from './create-monday-item.dto';

export class UpdateMondayItemDto extends PartialType(CreateMondayItemDto) {}
