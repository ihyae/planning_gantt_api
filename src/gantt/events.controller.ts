import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { GanttService } from './gantt.service';
import { GanttEvent } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { Request,Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('gantt/event')
export class EventsController {
  constructor(private readonly ganttService: GanttService) { }

  @Post()
  async create(@Body() event: GanttEvent, @Res() res: Response, @Req() req: Request) {
    const createdEvent =  await this.ganttService.createEvent(event, req);
    res.send({ event: createdEvent });
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
  async remove(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
    const deletedEvent= await this.ganttService.deleteEvent(id, req);
    res.send({ event: deletedEvent });

  }
}
