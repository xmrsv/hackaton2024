import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import storage from '../util/cloud_storage';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { JwtService } from '@nestjs/jwt';
import { GetProfileUserDTO } from './dto/get-profile-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async create(user: CreateUserDto) {
        const newUser: User = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    async findAll() {
        return await this.userRepository.find({ relations: ['roles'] });
    }

    async findOneById(id: string) {
        return await this.userRepository.findOneByOrFail({ id: id });
    }

    async update(id: string, user: UpdateUserDTO) {
        const findUserById: User | null = await this.userRepository.findOneBy({
            id: id,
        });

        if (findUserById === null) {
            throw new HttpException(
                "User doesn't exists",
                HttpStatus.NOT_FOUND,
            );
        }

        const findUserByEmail: User | null =
            await this.userRepository.findOneBy({
                email: user.email,
            });

        if (findUserByEmail && findUserByEmail.id !== id) {
            throw new HttpException(
                'Email already in use',
                HttpStatus.CONFLICT,
            );
        }

        // si el teléfono que se pasó en el body esta usado
        const findUserByPhone: User | null =
            await this.userRepository.findOneBy({
                phone: user.phone,
            });

        if (findUserByPhone && findUserByPhone.id !== id) {
            throw new HttpException(
                'Phone already in use',
                HttpStatus.CONFLICT,
            );
        }

        // ahora, verifica si el id a actualizar es el mismo de antes, si es el mismo, no cambies nada
        const updatedUser = Object.assign(findUserById, user);

        // verificai el email si es nuevo o es el mismo
        if (findUserById.email === user.email) {
            updatedUser.email = findUserById.email;
        }

        // telefono
        if (findUserById.phone === user.phone) {
            updatedUser.phone = findUserById.phone;
        }

        return await this.userRepository.save(updatedUser);
    }

    async updateWithImage(file: Express.Multer.File, userId: string) {
        const url = (await storage(file, file.originalname)) as string;
        const findUserById: User | null = await this.userRepository.findOneBy({
            id: userId,
        });

        if (findUserById === null) {
            throw new HttpException(
                "User doesn't exists",
                HttpStatus.NOT_FOUND,
            );
        }

        if (url === undefined && url === null) {
            throw new HttpException(
                "Couldn't save image",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        const updatedUser = Object.assign(findUserById, { image: url });
        return this.userRepository.save(updatedUser);
    }

    async updatePassword(
        id: string,
        password: UpdatePasswordDTO,
    ): Promise<User> {
        const user = await this.userRepository.findOneByOrFail({ id: id });
        const isValidPassword = await user.comparePassword(
            password.current_password,
        );
        const newHashedPassword = await user.hashPassword(
            password.new_password,
        );
        user.password = newHashedPassword;
        return await this.userRepository.save(user);
    }

    async getProfile(id: string) {
        const user = await this.userRepository.findOneByOrFail({ id: id });

        const getProfileUserDTO = new GetProfileUserDTO();

        Object.assign(getProfileUserDTO, {
            id: user.id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            roles: user.roles?.map((role) => role.name),
            created_at: user.created_at,
            updated_at: user.updated_at,
        });

        return getProfileUserDTO;
    }
}
