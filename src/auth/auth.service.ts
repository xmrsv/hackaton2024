import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterAuthDTO } from './dto/register-auth.dto';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/rol/rol.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Rol) private rolRepository: Repository<Rol>,

        private jwtService: JwtService,
    ) {}

    async register(user: RegisterAuthDTO) {
        const { id, email, phone } = user;

        const emailExist = await this.userRepository.findOneBy({
            email: email,
        });
        const idExist = await this.userRepository.findOneBy({ id: id });
        const userMatchesPhone: User = await this.userRepository.findOneBy({
            phone: phone,
        });

        if (emailExist) {
            throw new HttpException(
                'Email already exists',
                HttpStatus.CONFLICT,
            );
        }

        if (idExist) {
            throw new HttpException('ID already exists', HttpStatus.CONFLICT);
        }

        if (userMatchesPhone) {
            throw new HttpException(
                'phone number already exists',
                HttpStatus.CONFLICT,
            );
        }

        const newUser: User = this.userRepository.create(user);
        let rolesIds = [];

        if (user.rolesIds !== undefined && user.rolesIds !== null) {
            rolesIds = user.rolesIds;
        } else {
            rolesIds.push('STUDENT');
        }

        const roles: Rol[] = await this.rolRepository.findBy({
            id: In(rolesIds),
        });
        newUser.roles = roles;

        const savedUser: User = await this.userRepository.save(newUser);

        const rolesToStringArray: string[] = savedUser.roles.map(
            (rol) => rol.id,
        );
        const payload = {
            id: savedUser.id,
            name: savedUser.name,
            roles: rolesToStringArray,
        };
        const token: string = this.jwtService.sign(payload);
        const data = {
            user: savedUser,
            token: 'Bearer ' + token,
        };
        delete data.user.password;
        return data;
    }

    async login(loginData: LoginAuthDTO) {
        const { email, password } = loginData;
        const userFound = await this.userRepository.findOne({
            where: { email: email },
            relations: ['roles'],
        });
        if (!userFound) {
            throw new HttpException(
                "Email doesn't exists",
                HttpStatus.NOT_FOUND,
            );
        }

        const isPasswordValid: boolean = await compare(
            password,
            userFound.password,
        );
        if (!isPasswordValid) {
            console.log('Wrong password');
            throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
        }

        const rolesIdToStringArray: string[] = userFound.roles.map(
            (rol) => rol.id,
        );

        const payload = {
            id: userFound.id,
            name: userFound.name,
            roles: rolesIdToStringArray,
        };
        const token: string = this.jwtService.sign(payload);
        const data = {
            user: userFound,
            token: 'Bearer ' + token,
        };

        delete data.user.password;

        return data;
    }
}
