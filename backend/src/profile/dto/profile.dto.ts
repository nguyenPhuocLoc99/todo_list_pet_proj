import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  cvPath: string;

  @IsInt()
  @IsNotEmpty()
  salary: number;

  @IsString()
  @IsOptional()
  onboardDate?: string;

  @IsString()
  @IsOptional()
  division?: string;

  @IsString()
  @IsOptional()
  contractPath?: string;

  @IsNumber()
  @IsOptional()
  remainingLeaves?: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class EditProfileDto {
  @IsString()
  @IsOptional()
  cvPath: string;

  @IsInt()
  @IsOptional()
  salary: number;

  @IsString()
  @IsOptional()
  onboardDate?: string;

  @IsString()
  @IsOptional()
  division?: string;

  @IsString()
  @IsOptional()
  contractPath?: string;

  @IsNumber()
  @IsOptional()
  remainingLeaves?: number;

  @IsInt()
  @IsOptional()
  userId: number;
}
