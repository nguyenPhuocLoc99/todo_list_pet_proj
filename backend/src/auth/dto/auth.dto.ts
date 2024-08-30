import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    login_name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    name: string
}

export class AuthSigninDto {
    @IsString()
    @IsNotEmpty()
    login_name: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}