import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto, TaskAccessDto, EditTaskDto, LogworkDto } from './dto';
import { Permission, Status } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async getTaskById(taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  async createTask(dto: CreateTaskDto, userId: number) {
    if (dto.estimation) dto.estimation = this.time2ISO(dto.estimation);
    if (dto.startTime) dto.startTime = this.datetime2ISO(dto.startTime);
    if (dto.dueTime) dto.dueTime = this.datetime2ISO(dto.dueTime);

    const newTask = await this.prisma.task.create({
      data: {
        status: Status['toDo'],
        ...dto,
      },
    });

    await this.prisma.accessControl.create({
      data: {
        userId: userId,
        taskId: newTask.id,
        permission: Object.values(Permission),
      },
    });
    return { message: 'New task created' };
  }

  async createTaskAccess(taskId: number, dto: TaskAccessDto) {
    const accesses = await this.prisma.accessControl.findFirst({
      where: {
        taskId: taskId,
        userId: dto.userId,
      },
    });

    if (accesses)
      throw new ForbiddenException(
        'Access exist. Please edit the already existed access',
      );

    const data = { userId: dto.userId, permission: [] };
    for (const permission of dto.permission) {
      if (Permission[permission]) data.permission.push(Permission[permission]);
    }

    await this.prisma.accessControl.create({
      data: {
        taskId: taskId,
        ...data,
      },
    });
    return { message: 'New task access created' };
  }

  async editTaskById(taskId: number, dto: EditTaskDto, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    if (dto.estimation) dto.estimation = this.time2ISO(dto.estimation);
    if (dto.startTime) dto.startTime = this.datetime2ISO(dto.startTime);
    if (dto.dueTime) dto.dueTime = this.datetime2ISO(dto.dueTime);

    // if change status
    if (
      dto.status &&
      Status[dto.status as keyof typeof Status] !== task.status
    ) {
      const statusPermissions = await this.prisma.accessControl.findFirst({
        where: {
          userId: userId,
          taskId: taskId,
        },
      });
      const permissions: string[] = Object.values(statusPermissions.permission);

      // check change status permissions
      if (
        permissions.some((permission) =>
          permission.toLowerCase().includes(dto.status.toLowerCase()),
        ) ||
        dto.status === 'toDo'
      )
        dto.status = Status[dto.status as keyof typeof Status];
      else throw new UnauthorizedException('Access denied');
    }

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

  async editTaskAccess(taskId: number, dto: TaskAccessDto) {
    const accesses = await this.prisma.accessControl.findFirst({
      where: {
        taskId: taskId,
        userId: dto.userId,
      },
    });

    if (!accesses) throw new NotFoundException('Access not found');

    const data = { userId: dto.userId, permission: [] };
    for (const permission of dto.permission) {
      if (Permission[permission]) data.permission.push(Permission[permission]);
    }

    await this.prisma.accessControl.update({
      where: {
        id: accesses.id,
        taskId: taskId,
        userId: dto.userId,
      },
      data: {
        permission: { set: [...data.permission] },
      },
    });
    return { message: 'Access updated' };
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

  async deleteTaskAccess(taskId: number, dto: TaskAccessDto) {
    const accesses = await this.prisma.accessControl.findFirst({
      where: {
        taskId: taskId,
        userId: dto.userId,
      },
    });

    if (!accesses) throw new NotFoundException('Access not found');

    await this.prisma.accessControl.delete({
      where: {
        id: accesses.id,
      },
    });
    return { message: 'Access deleted' };
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

  async logwork(taskId: number, userId: number, dto: LogworkDto) {
    dto.timeSpent = this.time2ISO(dto.timeSpent);
    if (dto.date) dto.date = this.datetime2ISO(dto.date);

    dto['taskId'] = taskId;
    dto['userId'] = userId;

    await this.prisma.logWork.create({
      data: {
        ...dto,
      },
    });
    return { message: 'Log work success' };
  }

  getLogworkById(taskId: number) {
    return this.prisma.logWork.findMany({
      where: {
        taskId: taskId,
      },
    });
  }
}
