import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voluntario } from './Voluntario';

@Entity({name:'seccional'})
export class Seccional {
  @PrimaryGeneratedColumn({ name: 'id_seccional', type: 'int', unsigned: true })
  id: string;

  @Column({ name: 'departamento', type: 'varchar', length: '30' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 30)
  departamento: string;

  @Column({ name: 'municipio', type: 'varchar', length: '30' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 30)
  municipio: string;

  @Column({ name: 'codigo', type: 'varchar', length: '30' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 30)
  codigo: string;

  @OneToMany(
    (type) => Voluntario,
    (voluntario) => voluntario.cuerpoFilial
  )
  voluntarios: Voluntario[];
}
