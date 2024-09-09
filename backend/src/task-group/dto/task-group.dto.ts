import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
