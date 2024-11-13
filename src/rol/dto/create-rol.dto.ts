import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRolDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsString()
    route: string;
}
