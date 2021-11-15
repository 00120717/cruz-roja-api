import { IsNotEmpty, IsString, Length } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permiso } from './Permiso';
import { User } from './User';

@Entity({name:'rol'})
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_rol', type: 'int' })
  id: number;

  @Column({ name: 'rol_nombre', type: 'varchar', length: '20' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  nombre: string;

  @Column({ name: 'rol_tipo', type: 'varchar', length: '20' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  tipo: string;

  @ManyToMany((type) => Permiso)
  @JoinTable()
  permisos: Permiso[];

  @OneToMany(
    (type) => User,
    (user) => user.role
  )
  users: User[];
}
