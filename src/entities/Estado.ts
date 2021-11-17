import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voluntario } from './Voluntario';

@Entity({ name: 'estado' })
export class Estado {
  @PrimaryGeneratedColumn({ name: 'id_estado', type: 'int', unsigned: true })
  id: string;

  @Column({ name: 'estado_voluntario', type: 'varchar', length: '30' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 30)
  estadoVoluntario: string;

  @OneToMany(
    (type) => Voluntario,
    (voluntario) => voluntario.estado
  )
  voluntarios: Voluntario[];
}
