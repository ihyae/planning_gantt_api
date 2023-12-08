import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GanttService } from './gantt.service';
import { EventsController } from './events.controller';

@Module({
  controllers: [EventsController],
  providers: [GanttService, PrismaService, JwtService],
})
export class GanttModule {}
