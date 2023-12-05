import { Injectable } from '@nestjs/common';
import { GanttProject } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class GanttProjectService {
  constructor(private readonly prisma: PrismaService) { }

  async createGanttProject(project: GanttProject, authId: string) {

    const { name, description } = project;
    return this.prisma.ganttProject.create({
      data: {
        name,
        description,
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

  async getGanttProjects(authId: string) {

    return this.prisma.ganttProject.findMany({
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

  async getGanttProjectById(_id: string, authId: string) {

    return this.prisma.ganttProject.findUnique({
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

  async updateGanttProject(_id: string, project: GanttProject, authId: string) {
    const { name, description } = project;
    return this.prisma.ganttProject.update({
      where: {
        id: _id,
        createdBy: {
          id: authId
        }
      },
      data: {
        name,
        description
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

  async deleteGanttProject(_id: string, authId: string) {
    const events = await this.prisma.ganttEvent.findMany({
      where: {
        projectId: _id
      }
    })
    return await this.prisma.$transaction([
      this.prisma.ganttEvent.deleteMany({
        where: {
          id: {
            in: events.map(event => event.id)
          }
        }
      }),
      this.prisma.ganttProject.delete({
        where: {
          id: _id,
          createdBy: {
            id: authId
          }
        }
      })
    ]

    )

  }

}