import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { GanttProjectDto } from './gantt-project.dto';

export class UpdateProjectDto extends PartialType(GanttProjectDto) {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}
