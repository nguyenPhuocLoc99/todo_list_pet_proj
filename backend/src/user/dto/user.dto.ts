import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  loginName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  otherContacts?: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean = false;
}

export class EditUserDto {
  @IsString()
  @IsOptional()
  loginName?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  otherContacts?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
