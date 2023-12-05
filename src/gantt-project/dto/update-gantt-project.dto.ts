import { PartialType } from '@nestjs/mapped-types';
import { CreateGanttProjectDto } from './create-gantt-project.dto';

export class UpdateGanttProjectDto extends PartialType(CreateGanttProjectDto) {}
