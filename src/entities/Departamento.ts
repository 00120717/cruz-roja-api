import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DepartamentoXMunicipio } from './DepartamentoXMunicipio';

@Entity({ name: 'departamento' })
export class Departamento {
  @PrimaryGeneratedColumn({ name: 'id_departamento', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'nombre', type: 'varchar', length: '50' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 30)
  departamentoNombre: string;

  @OneToMany(
    (type) => DepartamentoXMunicipio,
    (departamentoXMunicipio) => departamentoXMunicipio.municipio
  )
  departamentoXmunicipio: DepartamentoXMunicipio[];
}
