import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { GanttService } from './gantt.service';
import { GanttEvent } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('gantt/event')
export class EventsController {
  constructor(private readonly ganttService: GanttService) { }

  @Post()
  async create(@Body() event: GanttEvent, @Req() req: Request) {
    return this.ganttService.createEvent(event, req);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return await this.ganttService.getEvents(req);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    return await this.ganttService.getEventById(id, req);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() event: GanttEvent, @Req() req: Request) {
    return await this.ganttService.updateEvent(id, event, req);
  }


  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    return this.ganttService.deleteEvent(id, req);
  }
}
