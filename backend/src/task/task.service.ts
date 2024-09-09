import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, EditTaskDto } from './dto';
import { Status } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getTaskById(taskId: number, userId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId: userId,
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  async createTask(dto: CreateTaskDto) {
    if (dto.estimation) dto.estimation = this.time2ISO(dto.estimation);
    if (dto.startTime) dto.startTime = this.datetime2ISO(dto.startTime);
    if (dto.dueTime) dto.dueTime = this.datetime2ISO(dto.dueTime);

    await this.prisma.task.create({
      data: {
        status: Status['toDo'],
        ...dto,
      },
    });
    return { message: 'New task created' };
  }

  async editTaskById(taskId: number, dto: EditTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    if (dto.estimation) dto.estimation = this.time2ISO(dto.estimation);
    if (dto.startTime) dto.startTime = this.datetime2ISO(dto.startTime);
    if (dto.dueTime) dto.dueTime = this.datetime2ISO(dto.dueTime);
    if (dto.status) dto.status = Status[dto.status as keyof typeof Status];

    await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
    return { message: 'Task updated' };
  }

  async deleteTaskById(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
    return { message: 'Task deleted' };
  }

  time2ISO(inp: string) {
    if (inp) {
      const estimationRegex = /(\d{2}):(\d{2}):(\d{2})/;
      if (!estimationRegex.test(inp))
        throw new ForbiddenException('Estimation must have format hh:mm:ss');
      return `1970-01-01T${inp}.000Z`;
    }
    return '';
  }

  datetime2ISO(inp: string) {
    if (inp) {
      const dateTimeRegex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
      if (!dateTimeRegex.test(inp))
        throw new ForbiddenException(
          'Start time must have format yyyy-mm-dd hh:mm:ss',
        );
      const [date_part, time_part] = inp.split(' ');
      return `${date_part}T${time_part}.000Z`;
    }
    return '';
  }
}
