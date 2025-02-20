import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt/jwt.constants';
import { JwtStrategy } from './jwt/jwt.strategy';
import { RolesService as RoleService } from 'src/rol/roles.service';
import { Rol } from 'src/rol/rol.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Rol]),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '6h' },
        }),
    ],
    providers: [AuthService, RoleService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
