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

  // get Group by id
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

  // get Groups list by user id
  async getGroupsList(userId: number) {
    const groupsList = await this.prisma.accessControl.findMany({
      where: {
        userId: userId,
        group: {
          isNot: null,
        },
      },
      include: {
        group: true,
      },
    });
    return groupsList.map((group) => group.group);
  }

  // get Group tasks list
  getGroupTasksList(groupId: number) {
    return this.prisma.task.findMany({
      where: {
        groupId: groupId,
      },
    });
  }

  // create Group
  async createGroup(dto: CreateTaskGroupDto, userId: number) {
    if (dto.taskNames) {
      const taskNamesArray = dto.taskNames.split(`,[ ]?`);
      const tasksList: Array<Object> = [];
      for (const taskName of taskNamesArray) {
        const task = await this.prisma.task.findFirst({
          where: {
            taskName,
          },
        });

        if (task) tasksList.push({ id: task.id });
      }

      dto['tasks'] = { set: tasksList };
      delete dto.taskNames;
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

  // create Group access
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

  // edit Group by id
  async editGroupById(groupId: number, dto: EditTaskGroupDto) {
    if (dto.taskNames) {
      const taskNamesArray = dto.taskNames.split(`,[ ]?`);
      const tasksList: Array<Object> = [];
      for (const taskName of taskNamesArray) {
        const task = await this.prisma.task.findFirst({
          where: {
            taskName,
          },
        });

        if (task) tasksList.push({ id: task.id });
      }

      dto['tasks'] = { set: tasksList };
    } else {
      dto['tasks'] = { set: [] };
    }
    delete dto.taskNames;

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

  // edit Group access
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

  // delete Group by id
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

  // delete Group access
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
