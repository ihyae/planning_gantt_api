import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { GanttProjectService } from './gantt-project.service';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { GanttProject } from '@prisma/client';
import { Request, Response } from 'express'
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('gantt-project')
export class GanttProjectController {
    constructor(private readonly ganttProjectService: GanttProjectService) { }


    @Post()
    async create(@Body() project: GanttProject, @Req() req: Request, @Res() res: Response) {
        try {
            const auth = req.user as JwtPayload;
            if (!auth.id) {
                throw new UnauthorizedException('User not authenticated');
            }
            const createdProject = await this.ganttProjectService.createGanttProject(project, auth.id);

            res.status(HttpStatus.CREATED).send(createdProject);
        } catch (error) {
            console.error('Create project error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'Error creating Gantt project',
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
            const projects = await this.ganttProjectService.getGanttProjects(auth.id);;

            res.status(HttpStatus.CREATED).send(projects);
        } catch (error) {
            console.error('Get projects error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'Error fetching Gantt projects',
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
            const project = await this.ganttProjectService.getGanttProjectById(id, auth.id);;

            res.status(HttpStatus.CREATED).send(project);
        } catch (error) {
            console.error('Get project by id error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'Error fetching Gantt project by id',
            });
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() project: GanttProject, @Req() req: Request, @Res() res: Response) {
        try {
            const auth = req.user as JwtPayload;
            if (!auth.id) {
                throw new UnauthorizedException('User not authenticated');
            }
            const updatedProject = await this.ganttProjectService.updateGanttProject(id, project, auth.id);;

            res.status(HttpStatus.CREATED).send(updatedProject);
        } catch (error) {
            console.error('Update project error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'Error updating Gantt project',
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
            const project = await this.ganttProjectService.deleteGanttProject(id, auth.id);;

            res.status(HttpStatus.CREATED).send(project);
        } catch (error) {
            console.error('Delete project error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'Error deleting Gantt project',
            });
        }
    }
}
