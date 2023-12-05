import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { GanttService } from './gantt.service';
import { GanttEvent } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

@UseGuards(JwtAuthGuard)
@Controller('gantt/event')
export class EventsController {
  constructor(private readonly ganttService: GanttService) { }


  @Post()
  async create(@Body() event: GanttEvent, @Req() req: Request, @Res() res: Response) {
    try {
      const auth = req.user as JwtPayload;
      if (!auth.id) {
        throw new UnauthorizedException('User not authenticated');
      }
      const createdEvent = await this.ganttService.createEvent(event, auth.id);

      res.status(HttpStatus.CREATED).send(createdEvent);
    } catch (error) {
      console.error('Create event error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error creating Gantt event',
      });
    }
  }

  @Get()
  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const auth = req.user as JwtPayload;
      if (!auth.id) {
        throw new UnauthorizedException('User not authenticated');
      }
      const events = await this.ganttService.getEvents(auth.id);;

      res.status(HttpStatus.CREATED).send(events);
    } catch (error) {
      console.error('Get events error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error fetching Gantt events',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const auth = req.user as JwtPayload;
      if (!auth.id) {
        throw new UnauthorizedException('User not authenticated');
      }
      const event = await this.ganttService.getEventById(id, auth.id);;

      res.status(HttpStatus.CREATED).send(event);
    } catch (error) {
      console.error('Get event by id error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error fetching Gantt event by id',
      });
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() event: GanttEvent, @Req() req: Request, @Res() res: Response) {
    try {
      const auth = req.user as JwtPayload;
      if (!auth.id) {
        throw new UnauthorizedException('User not authenticated');
      }
      const updatedEvent = await this.ganttService.updateEvent(id, event, auth.id);;

      res.status(HttpStatus.CREATED).send(updatedEvent);
    } catch (error) {
      console.error('Update event error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error updating Gantt event',
      });
    }
  }


  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const auth = req.user as JwtPayload;
      if (!auth.id) {
        throw new UnauthorizedException('User not authenticated');
      }
      const event = await this.ganttService.deleteEvent(id, auth.id);;

      res.status(HttpStatus.CREATED).send(event);
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error deleting Gantt event',
      });
    }
  }
}
