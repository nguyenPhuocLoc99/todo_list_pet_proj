import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissonsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    // handle no permisson required case
    if (!requiredPermissions) {
      return true;
    }

    const paramId: number = parseInt(
      context.switchToHttp().getRequest().params.id,
    );
    if (Number.isNaN(paramId)) throw new BadRequestException('No id found');

    const route: string = context.switchToHttp().getRequest().route.path;
    const isTask: boolean = route?.includes('tasks');
    const isGroup: boolean = route?.includes('groups');

    if (isTask && isGroup) throw new BadRequestException('Greedy request');
    if (!isTask && !isGroup) throw new BadRequestException('Give me 1 pls');

    // Get user permission info
    const request = context.switchToHttp().getRequest();
    const userId = request.user['id'];
    const query = isTask
      ? { userId: userId, taskId: paramId }
      : { userId: userId, groupId: paramId };

    const findPermission = await this.prisma.accessControl.findFirst({
      where: query,
    });

    // handle no permission found
    if (!findPermission) throw new UnauthorizedException('Access denied');

    const userPermission: string[] = Object.values(findPermission.permission);

    return requiredPermissions.some((permission) =>
      userPermission?.includes(permission),
    );
  }
}
