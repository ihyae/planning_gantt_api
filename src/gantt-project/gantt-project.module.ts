import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GanttProjectService } from './gantt-project.service';
import { GanttProjectController } from './gantt-project.controller';

@Module({
  controllers: [GanttProjectController],
  providers: [GanttProjectService, PrismaService, JwtService],
})
export class GanttProjectModule {}
