import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin/admin.guard';
import { Request, Response } from 'express';

@UseGuards(JwtAuthGuard)
@UseGuards(AdminGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.create(createUserDto);

      res.status(HttpStatus.CREATED).send(user);
    } catch (error) {
      console.error('Create user error:', error);

      if (error.meta?.target === 'User_username_key') {
        res.status(HttpStatus.CONFLICT).send({
          success: false,
          message: 'Username must be unique',
        });
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error creating User!',
      });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const users = await this.userService.findAll();
      res.status(HttpStatus.ACCEPTED).send(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error fetching users',
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.findOne(id);
      res.status(HttpStatus.FOUND).send(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error fetching user',
      });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      res.status(HttpStatus.ACCEPTED).send(user);
    } catch (error) {
      console.error('updating user error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error updating user',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.userService.remove(id);
      res.status(HttpStatus.OK).send(user);
    } catch (error) {
      console.error('Deleting user error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: 'Error Deleting user',
      });
    }
  }
}
