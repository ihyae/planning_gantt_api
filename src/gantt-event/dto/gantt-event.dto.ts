import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { TransformDate } from './transform-date.decorator';

export class GanttEventDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly projectId: string;

  @IsNotEmpty()
  // @IsDate()
  @Transform(TransformDate)
  readonly start?: Date;

  @IsNotEmpty()
  // @IsDate()
  @Transform(TransformDate)
  readonly end?: Date;

  @IsOptional()
  @IsInt()
  readonly duration?: number;
}
