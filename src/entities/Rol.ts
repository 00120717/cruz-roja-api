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
import { Usuario } from './Usuario';

@Entity({ name: 'rol' })
export class Rol {
  @PrimaryGeneratedColumn({ name: 'id_rol', type: 'int', unsigned: true  })
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
  @JoinTable({
    name: 'rolXpermiso',
    joinColumn: {
      name: 'id_rol',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_permiso',
      referencedColumnName: 'id'
    }
  })
  permisos: Permiso[];

  @OneToMany(
    (type) => Usuario,
    (usuario) => usuario.rol
  )
  users: Usuario[];
}
