import { IsEmail, IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
    @IsOptional()
    @IsNumberString()
    id: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    lastname: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsNumberString()
    phone: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    notification_token?: string;
}
