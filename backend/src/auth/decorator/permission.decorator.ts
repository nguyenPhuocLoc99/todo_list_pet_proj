import { ParseIntPipe, SetMetadata } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

prisma: PrismaService;

export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
