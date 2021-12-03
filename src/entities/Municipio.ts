import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DepartamentoXMunicipio } from './DepartamentoXMunicipio';

@Entity({ name: 'municipio' })
export class Municipio {
  @PrimaryGeneratedColumn({ name: 'id_municipio', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'nombre', type: 'varchar', length: '50' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 30)
  municipioNombre: string;

  @OneToMany(
    (type) => DepartamentoXMunicipio,
    (departamentoXMunicipio) => departamentoXMunicipio.municipio
  )
  departamentoXmunicipio: DepartamentoXMunicipio[];
}
