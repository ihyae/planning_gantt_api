import { Injectable } from '@nestjs/common';
import { GanttEvent, GanttProject } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class GanttService {
  constructor(private readonly prisma: PrismaService) { }

  async createEvent(event: GanttEvent, authId: string) {
    const { title, start, end, projectId } = event;
    return this.prisma.ganttEvent.create({
      data: {
        title,
        start,
        end,
        project: {
          connect: { id: event.projectId },
        },
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

  async updateEvent(_id: string, event: GanttEvent, authId: string) {
  const { title, start, end, projectId } = event;

  return this.prisma.ganttEvent.update({
    where: {
      id: _id,
      createdBy: {
        id: authId
      }
    },
    data: {
      title,
      start,
      end
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
