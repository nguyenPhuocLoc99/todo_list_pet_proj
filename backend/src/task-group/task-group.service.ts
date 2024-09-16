import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskGroupDto, EditTaskGroupDto, GroupAccessDto } from './dto';
import { Permission } from '@prisma/client';

@Injectable()
export class TaskGroupService {
  constructor(private prisma: PrismaService) {}

  getGroupById(groupId: number) {
    return this.prisma.taskGroup.findUnique({
      where: {
        id: groupId,
      },
      include: {
        tasks: true,
      },
    });
  }

  async createGroup(dto: CreateTaskGroupDto, userId: number) {
    if (dto.taskIds.length) {
      const tasksList: Array<Object> = [];
      for (const taskId of dto.taskIds) {
        if (typeof taskId === 'number') {
          const task = await this.prisma.task.findUnique({
            where: {
              id: taskId,
            },
          });

          if (task) tasksList.push({ id: task.id });
        }
      }

      dto['tasks'] = { connect: tasksList };
      delete dto.taskIds;
    }

    const newGroup = await this.prisma.taskGroup.create({
      data: {
        ...dto,
      },
      include: {
        tasks: true,
      },
    });

    await this.prisma.accessControl.create({
      data: {
        userId: userId,
        groupId: newGroup.id,
        permission: Object.values(Permission).filter(
          (permission) => !permission.includes('allow'),
        ),
      },
    });

    return { message: 'New task group created' };
  }

  async createGroupAccess(groupId: number, dto: GroupAccessDto) {
    const accesses = await this.prisma.accessControl.findFirst({
      where: {
        groupId: groupId,
        userId: dto.userId,
      },
    });

    if (accesses)
      throw new ForbiddenException(
        'Access exist. Please edit the already existed access',
      );

    const data = { userId: dto.userId, permission: [] };
    for (const permission of dto.permission) {
      if (Permission[permission] && !permission.includes('allow'))
        data.permission.push(Permission[permission]);
    }

    await this.prisma.accessControl.create({
      data: {
        groupId: groupId,
        ...data,
      },
    });
    return { message: 'New task group access created' };
  }

  async editGroupById(groupId: number, dto: EditTaskGroupDto) {
    if (dto.taskIds.length) {
      const tasksList: Array<Object> = [];
      for (const taskId of dto.taskIds) {
        if (typeof taskId === 'number') {
          const task = await this.prisma.task.findUnique({
            where: {
              id: taskId,
            },
          });

          if (task) tasksList.push({ id: task.id });
        }
      }

      dto['tasks'] = { set: tasksList };
      delete dto.taskIds;
    }

    return this.prisma.taskGroup.update({
      where: {
        id: groupId,
      },
      data: {
        ...dto,
      },
      include: {
        tasks: true,
      },
    });
  }

  async editGroupAccess(groupId: number, dto: GroupAccessDto) {
    const accesses = await this.prisma.accessControl.findFirst({
      where: {
        groupId: groupId,
        userId: dto.userId,
      },
    });

    if (!accesses) throw new NotFoundException('Access not found');

    const data = { userId: dto.userId, permission: [] };
    for (const permission of dto.permission) {
      if (Permission[permission] && !permission.includes('allow'))
        data.permission.push(Permission[permission]);
    }

    await this.prisma.accessControl.update({
      where: {
        id: accesses.id,
      },
      data: {
        permission: { set: [...data.permission] },
      },
    });
    return { message: 'Access updated' };
  }

  async deleteGroupById(groupId: number) {
    const group = await this.prisma.taskGroup.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) throw new NotFoundException('Task group not found');

    await this.prisma.taskGroup.delete({
      where: {
        id: groupId,
      },
    });
    return { message: 'Task group deleted' };
  }

  async deleteGroupAccess(groupId: number, dto: GroupAccessDto) {
    const accesses = await this.prisma.accessControl.findFirst({
      where: {
        groupId: groupId,
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
}
