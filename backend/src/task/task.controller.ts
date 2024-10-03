import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { GetUser, Permissions } from 'src/auth/decorator';
import { JwtGuard, PermissonsGuard } from 'src/auth/guard';
import { CreateTaskDto, TaskAccessDto, EditTaskDto, LogworkDto } from './dto';

@UseGuards(JwtGuard, PermissonsGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get(':id')
  @Permissions('read')
  getTaskById(@Param('id', ParseIntPipe) taskId: number) {
    return this.taskService.getTaskById(taskId);
  }

  @Get('')
  getTasksList(@GetUser('id') userId: number) {
    return this.taskService.getTasksList(userId);
  }

  @Post('create')
  createTask(@Body() dto: CreateTaskDto, @GetUser('id') userId: number) {
    return this.taskService.createTask(dto, userId);
  }

  @Post(':id')
  @Permissions('updateAccess')
  createTaskAccess(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: TaskAccessDto,
  ) {
    return this.taskService.createTaskAccess(taskId, dto);
  }

  @Patch(':id')
  @Permissions(
    'updateInfo',
    'allowInProgress',
    'allowReview',
    'allowDone',
    'allowCancel',
    'allowReassignTask',
  )
  editTaskById(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: EditTaskDto,
    @GetUser('id') userId: number,
  ) {
    return this.taskService.editTaskById(taskId, dto, userId);
  }

  @Patch(':id/access')
  @Permissions('updateAccess')
  editTaskAccess(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: TaskAccessDto,
  ) {
    return this.taskService.editTaskAccess(taskId, dto);
  }

  @Delete(':id')
  @Permissions('delete')
  deleteTaskById(@Param('id', ParseIntPipe) taskId: number) {
    return this.taskService.deleteTaskById(taskId);
  }

  @Delete(':id/access')
  @Permissions('updateAccess')
  deleteTaskAccess(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: TaskAccessDto,
  ) {
    return this.taskService.deleteTaskAccess(taskId, dto);
  }

  @Get(':id/logwork')
  @Permissions('read')
  getLogworkById(@Param('id', ParseIntPipe) taskId: number) {
    return this.taskService.getLogworkById(taskId);
  }

  @Post(':id/logwork')
  @Permissions(
    'allowInProgress',
    'allowReview',
    'allowDone',
    'allowCancel',
    'allowReassignTask',
  )
  logwork(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
    @Body() dto: LogworkDto,
  ) {
    return this.taskService.logwork(taskId, userId, dto);
  }
}
