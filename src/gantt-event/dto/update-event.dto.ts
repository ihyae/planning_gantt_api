import { PartialType } from '@nestjs/mapped-types';
import { GanttEventDto } from './gantt-event.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEventDto extends PartialType(GanttEventDto) {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}
