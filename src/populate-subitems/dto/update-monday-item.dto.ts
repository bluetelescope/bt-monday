import { PartialType } from '@nestjs/mapped-types';
import { ValidateMondayDto } from './validate-monday.dto';

export class UpdateMondayItemDto extends PartialType(ValidateMondayDto) {}
