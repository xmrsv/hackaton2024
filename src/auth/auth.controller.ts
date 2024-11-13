import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDTO } from './dto/register-auth.dto';
import { LoginAuthDTO } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() user: RegisterAuthDTO) {
        return this.authService.register(user);
    }

    @Post('login')
    login(@Body() loginData: LoginAuthDTO) {
        return this.authService.login(loginData);
    }
}
