import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GanttEvent, Prisma, UserType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { GanttEventDto } from './dto/gantt-event.dto';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class GanttService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(event: GanttEventDto, auth: JwtPayload) {
    const { title, start, end, projectId } = event;
    // Check if project exists
    await this.findProjectById(projectId);

    // If user is a team member, check permission
    if (auth.userType === UserType.teamMember) {
      await this.checkUserPermission(auth.id, projectId);
    }

    // Create the Gantt event
    return await this.prisma.ganttEvent.create({
      data: {
        title,
        start,
        end,
        project: {
          connect: { id: projectId },
        },
        createdBy: {
          connect: { id: auth.id },
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        project: true,
      },
    });
  }
  private async findProjectById(projectId: string): Promise<void> {
    const project = await this.prisma.ganttProject.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      throw new NotFoundException('Selected project not found!');
    }
  }

  private async checkUserPermission(
    userId: string,
    projectId: string,
  ): Promise<void> {
    const assignedProj = await this.prisma.assignedUserGanttProject.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!assignedProj) {
      throw new UnauthorizedException(
        "You don't have permission to add an event!",
      );
    }
  }
  async getEvents(auth: JwtPayload) {
    let where: { createdBy?: { id: string } };
    if (auth.userType !== UserType.admin) {
      where = {
        createdBy: { id: auth.id },
      };
    }
    return this.prisma.ganttEvent.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        project: true,
      },
    });
  }

  async getEventById(id: string, auth: JwtPayload) {
    let where: { id: string; createdBy?: { id: string } };
    if (auth.userType === UserType.admin) {
      where = {
        id,
      };
    } else {
      where = {
        id,
        createdBy: { id: auth.id },
      };
    }

    const event = await this.prisma.ganttEvent.findUnique({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        project: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found!');
    }
    return event;
  }

  async updateEvent(event: UpdateEventDto, auth: JwtPayload) {
    const { id, title, start, end } = event;
    let where: { id: string; createdBy?: { id: string } };
    if (auth.userType === UserType.admin) {
      where = {
        id,
      };
    } else {
      where = {
        id,
        createdBy: { id: auth.id },
      };
    }

    return this.prisma.ganttEvent.update({
      where,
      data: {
        title,
        start,
        end,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        project: true,
      },
    });
  }

  async deleteEvent(eventId: string, auth: JwtPayload) {
    let where: { id: string; createdBy?: { id: string } };
    if (auth.userType === UserType.admin) {
      where = {
        id: eventId,
      };
    } else {
      where = {
        id: eventId,
        createdBy: { id: auth.id },
      };
    }
    const deletedEvent = await this.prisma.ganttEvent.delete({
      where,
    });

    if (!deletedEvent) {
      throw new NotFoundException('Event not found!');
    }

    return deletedEvent;
  }
}
