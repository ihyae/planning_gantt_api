import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { JwtPayload } from 'src/auth/jwt-payload.interface';


@Injectable()
export class GanttService {
  constructor(private readonly prisma: PrismaService) { }

  async createEvent(data: { title: string, start: Date, end: Date }, req: Request) {
    const { id } = req.user as JwtPayload

    if (!id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.prisma.ganttEvent.create({
      data: {
        ...data,
        createdBy: {
          connect: { id },
        },
      },
    });
  }

  async getEvents(req: Request) {
    const { id } = req.user as JwtPayload

    if (!id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.prisma.ganttEvent.findMany({
      where: {
        createdBy: {
          id
        }
      }
    });
  }

  async getEventById(_id: string, req: Request) {
    const { id } = req.user as JwtPayload

    if (!id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.prisma.ganttEvent.findUnique({
      where: {
        id: _id,
        createdBy: {
          id
        }
      }
    });
  }

  async updateEvent(_id: string, data: { title?: string, start?: Date, end?: Date }, req: Request) {
    const { id } = req.user as JwtPayload

    if (!id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.prisma.ganttEvent.update({
      where: {
        id: _id,
        createdBy: {
          id
        }
      }, data
    });
  }

  async deleteEvent(_id: string, req: Request) {
    try {
      const { id } = req.user as JwtPayload

      if (!id) {
        throw new UnauthorizedException('User not authenticated');
      }
  
      return this.prisma.ganttEvent.delete({
        where: {
          id: _id,
          createdBy: {
            id
          }
        }
      });
    } catch (error) {
      throw new Error('Delete event has been failed!');

    }
  
  }
}
