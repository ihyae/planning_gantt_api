import { Module } from '@nestjs/common';
import { GanttProjectService } from './gantt-project.service';
import { GanttProjectController } from './gantt-project.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [GanttProjectController],
  providers: [GanttProjectService, PrismaService, JwtService],
})
export class GanttProjectModule { }
