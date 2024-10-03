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

  // get Task by id
  async getTaskById(taskId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
      include: {
        assignee: true,
        group: true,
      },
    });

    if (!task) throw new NotFoundException('Task not found');

    return task;
  }

  // get Tasks list by user id
  async getTasksList(userId: number) {
    const tasksList = await this.prisma.accessControl.findMany({
      where: {
        userId: userId,
        task: {
          isNot: null,
        },
      },
      include: {
        task: true,
      },
    });
    return tasksList.map((task) => task.task);
  }

  // create Task
  async createTask(dto: CreateTaskDto, userId: number) {
    if (dto.estimation) dto.estimation = this.time2ISO(dto.estimation);
    if (dto.startTime) dto.startTime = this.datetime2ISO(dto.startTime);
    if (dto.dueTime) dto.dueTime = this.datetime2ISO(dto.dueTime);

    // Handle comma in name
    dto.taskName = dto.taskName.replace(/,/g, '');

    const taskData = {
      status: Status['toDo'],
      ...dto,
    };

    // Handle group
    if (dto.groupId && dto.groupId !== -1) {
      taskData['group'] = { connect: [{ id: dto.groupId }] };
    } else delete taskData['groupId'];

    if (dto.groupName) {
      const group = await this.prisma.taskGroup.findFirst({
        where: {
          groupName: dto.groupName,
        },
      });
      if (!group) throw new NotFoundException('Group not found');
      taskData['group'] = { connect: { id: group.id } };
    }
    delete taskData['groupName'];

    // Handle assignee
    if (dto.assigneeId && dto.assigneeId !== -1) {
      taskData['assignee'] = { connect: [{ id: dto.assigneeId }] };
    } else delete taskData['assigneeId'];

    if (dto.assigneeName) {
      const user = await this.prisma.user.findFirst({
        where: {
          name: dto.assigneeName,
        },
      });
      if (!user) throw new NotFoundException('User not found');
      taskData['assignee'] = { connect: { id: user.id } };
    }
    delete taskData['assigneeName'];

    // Filter all empty value
    for (const key in taskData) {
      if (!taskData[key]) delete taskData[key];
    }

    const newTask = await this.prisma.task.create({
      data: taskData,
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

  // create Task Access Control
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

  // edit Task by id
  async editTaskById(taskId: number, dto: EditTaskDto, userId: number) {
    // get task
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!task) throw new NotFoundException('Task not found');

    if (dto.estimation) dto.estimation = this.time2ISO(dto.estimation);
    if (dto.startTime) dto.startTime = this.datetime2ISO(dto.startTime);
    if (dto.dueTime) dto.dueTime = this.datetime2ISO(dto.dueTime);

    // Handle comma in name
    dto.taskName = dto.taskName.replace(/,/g, '');

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
      if (!statusPermissions) throw new NotFoundException('Access not found');
      const permissions: string[] = Object.values(statusPermissions.permission);

      // check change status permissions
      if (this.checkChangeStatusPermissions(permissions, dto.status))
        dto.status = Status[dto.status as keyof typeof Status];
      else throw new UnauthorizedException('Access denied');
    }

    const updateData = { ...dto };

    // Handle group
    if (dto.groupId && dto.groupId !== -1) {
      updateData['group'] = { connect: { id: dto.groupId } };
    } else delete updateData['groupId'];

    // Handle assignee
    if (dto.assigneeId && dto.assigneeId !== -1) {
      updateData['assignee'] = { connect: { id: dto.assigneeId } };
    } else delete updateData['assigneeId'];

    await this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...updateData,
      },
    });
    return { message: 'Task updated' };
  }

  // edit Task Access Control
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

  // delete Task by id
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

  // delete Task Access Control
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

  // time to ISO
  time2ISO(inp: string) {
    if (inp) {
      const estimationRegex = [/(\d{2}):(\d{2}):(\d{2})/, /(\d{2}):(\d{2})/];
      if (!estimationRegex.some((regex) => regex.test(inp)))
        throw new ForbiddenException('Invalid time format');
      const fulltime = inp.split(':').length === 3 ? inp : `${inp}:00`;
      return `1970-01-01T${fulltime}.000Z`;
    }
    return '';
  }

  // datetime to ISO
  datetime2ISO(inp: string) {
    if (inp) {
      const dateTimeRegex = [
        /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
        /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/,
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
        /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
      ];
      if (!dateTimeRegex.some((regex) => regex.test(inp)))
        throw new ForbiddenException('Invalid datetime format');
      const [date_part, time_part] = inp.split(/[ T]/);
      const fulltime =
        time_part.split(':').length === 3
          ? `${date_part}T${time_part}.000Z`
          : `${date_part}T${time_part}:00.000Z`;
      return fulltime;
    }
    return '';
  }

  // log work
  async logwork(taskId: number, userId: number, dto: LogworkDto) {
    dto.timeSpent = this.time2ISO(dto.timeSpent);
    if (dto.date) dto.date = this.datetime2ISO(dto.date);

    const logWorkData = {
      ...dto,
      taskId: taskId,
      userId: userId,
    };

    await this.prisma.logWork.create({
      data: logWorkData,
    });
    return { message: 'Log work success' };
  }

  // get Logwork by id
  getLogworkById(taskId: number) {
    return this.prisma.logWork.findMany({
      where: {
        taskId: taskId,
      },
    });
  }

  // check change status permissions
  // return true if new statue within the permissions
  // since we have check access control before this function,
  // the current user must have the permission to change the status
  // so if the new status is toDo the return true
  checkChangeStatusPermissions(permissions: string[], newStatus: string) {
    if (
      permissions.some((permission) =>
        permission.toLowerCase().includes(newStatus.toLowerCase()),
      ) ||
      newStatus === 'toDo'
    )
      return true;
    return false;
  }
}
