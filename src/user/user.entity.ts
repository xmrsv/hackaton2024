import { compare, hash } from 'bcrypt';
import { IsNotEmpty, IsString } from 'class-validator';
import { Enterprise } from 'src/enterprise/enterprise.entity';
import { Rol } from 'src/rol/rol.entity';
import { Time } from 'src/time/time.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @IsNotEmpty()
    @IsString()
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    notification_token: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // Tabla pivote / intermedia / conectora
    @JoinTable({
        name: 'user_has_roles',
        joinColumn: {
            name: 'user_id',
        },
        inverseJoinColumn: {
            name: 'rol_id',
        },
    })
    @ManyToMany(() => Rol, (rol) => rol.users)
    roles: Rol[];

    @ManyToOne(() => Enterprise, (enterprise) => enterprise.users, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'enterprise_id' })
    enterprise: Enterprise | null;

    @OneToMany(() => Time, (time) => time.user)
    times: Time[];

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.password = await hash(
            this.password,
            Number(process.env.HASH_SALT),
        );
    }

    async hashPassword(password: string) {
        return await hash(password, Number(process.env.HASH_SALT));
    }

    async comparePassword(attempt: string) {
        return await compare(attempt, this.password);
    }
}
