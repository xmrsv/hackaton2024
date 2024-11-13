import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdatePasswordDTO } from './dto/update-password.dto';

@Controller('user')
export class UsersController {
    constructor(private userService: UsersService) {}

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    async findAll() {
        return await this.userService.findAll();
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    async create(@Body() user: CreateUserDto) {
        return await this.userService.create(user);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: string,
        @Body() user: UpdateUserDTO,
    ) {
        return await this.userService.update(id, user);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateWithImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            }),
        )
        file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: string,
        @Body() user: UpdateUserDTO,
    ) {
        return this.userService.updateWithImage(file, id);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Patch(':id/enterprise/:enterpriseId')
    async assignEnterprise(
        @Param('id') userId: string,
        @Param('enterpriseId', ParseIntPipe) enterpriseId: number,
    ) {
        return await this.userService.assignEnterprise(userId, enterpriseId);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get(':id/enterprise') // Nueva ruta
    async getCurrentUserEnterprise(@Param('id') userId: string) {
        return await this.userService.getCurrentUserEnterprise(userId);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Patch(':userId/enterprise')
    async assignEnterpriseToUser(
        @Param('userId') userId: string,
        @Body('enterpriseId', ParseIntPipe) enterpriseId: number,
    ) {
        return await this.userService.assignEnterprise(userId, enterpriseId);
    }

    @UseGuards(AuthGuard)
    @Patch('password')
    async updatePassword(
        @Request() req,
        @Body() updatePasswordDTO: UpdatePasswordDTO,
    ) {
        return await this.userService.updatePassword(
            req.user.id,
            updatePasswordDTO,
        );
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        return await this.userService.getProfile(req.user.id);
    }
}
