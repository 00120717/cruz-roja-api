import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voluntario } from './Voluntario';

@Entity({name:'tipo_voluntario'})
export class TipoVoluntario {
  @PrimaryGeneratedColumn({ name: 'id_tipo_voluntario', type: 'int', unsigned: true })
  id: string;

  @Column({ name: 'tipo', type: 'varchar', length: '20' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 20)
  tipo: string;

  @OneToMany(
    (type) => Voluntario,
    (voluntario) => voluntario.tipoVoluntario
  )
  voluntarios: Voluntario[];
}
