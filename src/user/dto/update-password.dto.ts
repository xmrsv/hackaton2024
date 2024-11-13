import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDTO {
    @IsNotEmpty()
    @IsString()
    current_password: string;

    @IsNotEmpty()
    @IsString()
    new_password: string;
}
