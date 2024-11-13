import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';
import { Rol } from 'src/rol/rol.entity';
import { Enterprise } from 'src/enterprise/enterprise.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [TypeOrmModule.forFeature([User, Rol, Enterprise])],
    providers: [UsersService, JwtStrategy, JwtService],
    controllers: [UsersController],
})
export class UserModule {}
