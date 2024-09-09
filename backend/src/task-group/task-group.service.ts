import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskGroupDto, EditTaskGroupDto } from './dto';
import { NotFoundError } from 'rxjs';

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

  async createGroup(dto: CreateTaskGroupDto) {
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

    await this.prisma.taskGroup.create({
      data: {
        ...dto,
      },
      include: {
        tasks: true,
      },
    });
    return { message: 'New task group created' };
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
}
