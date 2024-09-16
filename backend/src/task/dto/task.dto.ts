import { Permission, Status } from '@prisma/client';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsInt()
  @IsOptional()
  group_id?: number;

  @IsString()
  @IsNotEmpty()
  taskName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  estimation?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  dueTime?: string;
}

export class EditTaskDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsInt()
  @IsOptional()
  groupId?: number;

  @IsString()
  @IsOptional()
  status?: Status;

  @IsString()
  @IsOptional()
  taskName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  estimation?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  dueTime?: string;
}
2;

export class TaskAccessDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsOptional()
  permission?: Permission[];
}

export class LogworkDto {
  @IsString()
  @IsNotEmpty()
  timeSpent: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  date?: string;

  userId: number;

  taskId: number;
}
