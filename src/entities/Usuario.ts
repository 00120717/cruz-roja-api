import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Length, IsNotEmptyObject, IsOptional } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Sede } from './Sede';
import { Rol } from './Rol';
import { Persona } from './Persona';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario', type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'contrasenia', type: 'varchar', length: '200', select: false })
  @Length(4, 200)
  contrasenia: string;

  @OneToOne((type) => Persona, { cascade: ['insert'], onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_persona' })
  @IsNotEmptyObject()
  persona: Persona;

  @ManyToOne(
    (type) => Rol,
    (rol) => rol.users
  )
  @JoinColumn({ name: 'id_rol' })
  @IsNotEmptyObject()
  rol: Rol;

  @ManyToOne(
    (type) => Sede,
    (sede) => sede.usuarios
  )
  @JoinColumn({ name: 'id_sede' })
  @IsOptional()
  sede: Sede;

  async hashPassword() {
    this.contrasenia = await bcrypt.hash(this.contrasenia, 10);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.contrasenia);
  }
}
