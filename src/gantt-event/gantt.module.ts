import { Module } from '@nestjs/common';
import { GanttService } from './gantt.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EventsController],
  providers: [GanttService, PrismaService, JwtService],
})
export class GanttModule {}
