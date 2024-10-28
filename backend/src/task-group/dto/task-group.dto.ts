import { Permission } from '@prisma/client';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskGroupDto {
  @IsString()
  @IsNotEmpty()
  groupName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  taskIds?: number[];

  @IsArray()
  @IsOptional()
  taskNames?: string[];
}

export class EditTaskGroupDto {
  @IsString()
  @IsOptional()
  groupName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  taskIds?: number[];

  @IsArray()
  @IsOptional()
  taskNames?: string[];
}

export class GroupAccessDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsOptional()
  permission?: Permission[];
}

export class GroupSuggestionsDto {
  @IsString()
  @IsOptional()
  query?: string;
}
