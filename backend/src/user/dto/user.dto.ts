import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  login_name: string;

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
  other_contacts?: string;

  @IsOptional()
  @IsBoolean()
  is_admin?: boolean = false;
}

export class EditUserDto {
  @IsString()
  @IsOptional()
  login_name?: string;

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
  other_contacts?: string;

  @IsBoolean()
  @IsOptional()
  is_admin?: boolean;
}
