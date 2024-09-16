import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchToolsService {
  constructor(private prisma: PrismaService) {}

  async searchTaskAndTaskGroup(keywordObj: object) {
    if (!keywordObj['keyword'])
      throw new BadRequestException('No keyword found');
    const kw = keywordObj['keyword'];

    const tasks = await this.prisma.task.findMany({
      where: {
        taskName: {
          contains: kw,
          mode: 'insensitive',
        },
      },
    });

    const taskGroups = await this.prisma.taskGroup.findMany({
      where: {
        groupName: {
          contains: kw,
          mode: 'insensitive',
        },
      },
    });

    if (!tasks.length && !taskGroups.length)
      throw new NotFoundException('No task or task group found');

    return { allTasks: tasks, allGroups: taskGroups };
  }
}
