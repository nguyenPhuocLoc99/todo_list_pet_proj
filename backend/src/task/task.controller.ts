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
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateTaskDto, EditTaskDto } from './dto';

@UseGuards(JwtGuard)
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get(':id')
  getTaskById(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
  ) {
    return this.taskService.getTaskById(taskId, userId);
  }

  @Post('create')
  createTask(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Patch(':id')
  editTaskById(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
    @Body() dto: EditTaskDto,
  ) {
    return this.taskService.editTaskById(taskId, dto);
  }

  @Delete(':id')
  deleteTaskById(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
  ) {
    return this.taskService.deleteTaskById(taskId);
  }
}
