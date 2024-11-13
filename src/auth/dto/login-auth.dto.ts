import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDTO {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
