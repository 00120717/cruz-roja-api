import { IsNotEmpty, IsString, IsOptional, IsNotEmptyObject } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { TipoSede } from './TipoSede';
import { Voluntario } from './Voluntario';

@Entity({name:'sede'})
export class Sede {
  @PrimaryGeneratedColumn({ name: 'id_sede', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'sede_nombre', type: 'text' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @Column({ name: 'sede_direccion', type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  direccion: string;
  
  @Column({ name: 'sede_codigo', type: 'text' })
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @ManyToOne(
    (type) => TipoSede,
    (tipoSede) => tipoSede.sedes
  )
  @JoinColumn({ name: 'id_tipo_sede' })
  @IsNotEmptyObject()
  tipoSede: TipoSede;

  @OneToMany(
    (type) => Voluntario,
    (voluntario) => voluntario.sede
  )
  voluntarios: Voluntario[];

  @OneToMany(
    (type) => Usuario,
    (usuario) => usuario.sede
  )
  usuarios: Usuario[];
}
