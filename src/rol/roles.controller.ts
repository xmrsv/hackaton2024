import {
    Body,
    Controller,
    Get,
    Post /*, UseGuards */,
    UseGuards,
} from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { RolesService } from './roles.service';
import { JwtRole } from 'src/auth/jwt/jwt-role';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';

@Controller('rol')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    /*
  @HasRoles(JwtRole.ADMIN)
  @UseGuards(JwtAuthGuard, JwtRolesGuard)
  */
    @Post()
    create(@Body() rol: CreateRolDto) {
        return this.rolesService.create(rol);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    findaAll() {
        return this.rolesService.findAll();
    }
}
