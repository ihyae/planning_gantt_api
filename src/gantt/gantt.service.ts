import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class GanttService {
  constructor(private readonly prisma: PrismaService) { }

  async createEvent(data: { title: string, start: Date, end: Date }, authId: string) {

    return this.prisma.ganttEvent.create({
      data: {
        ...data,
        createdBy: {
          connect: { id: authId },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async getEvents(authId: string) {

    return this.prisma.ganttEvent.findMany({
      where: {
        createdBy: {
          id: authId
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async getEventById(_id: string, authId: string) {

    return this.prisma.ganttEvent.findUnique({
      where: {
        id: _id,
        createdBy: {
          id: authId
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async updateEvent(_id: string, data: { title?: string, start?: Date, end?: Date }, authId: string) {

    return this.prisma.ganttEvent.update({
      where: {
        id: _id,
        createdBy: {
          id: authId
        }
      },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  async deleteEvent(_id: string, authId: string) {

      return this.prisma.ganttEvent.delete({
        where: {
          id: _id,
          createdBy: {
            id: authId
          }
        }
      });

  }
}
