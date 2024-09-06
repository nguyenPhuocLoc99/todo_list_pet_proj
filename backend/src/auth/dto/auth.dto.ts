import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthSignUpDto {
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

  is_admin: boolean = false;
}

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  login_name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
