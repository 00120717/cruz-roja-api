import { IsNotEmpty, IsNotEmptyObject, IsString, Length } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DepartamentoXMunicipio } from './DepartamentoXMunicipio';
import { EmergenciaSeccional } from './EmergenciaSeccional';

@Entity({ name: 'seccional' })
export class Seccional {
  @PrimaryGeneratedColumn({ name: 'id_seccional', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'codigo', type: 'varchar', length: '30' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 30)
  codigo: string;

  @Column({ name: 'nombre', type: 'text' })
  @IsNotEmpty()
  nombre: string;

  @ManyToOne(
    (type) => DepartamentoXMunicipio,
    (departamentoXmunicipio) => departamentoXmunicipio.sede
  )
  @JoinColumn({ name: 'id_departamentoxmunicipio' })
  @IsNotEmptyObject()
  departamentoXmunicipio: DepartamentoXMunicipio;

  @OneToMany(
    (type) => EmergenciaSeccional,
    (emergenciaSeccional) => emergenciaSeccional.seccional
  )
  emergenciaSeccional: EmergenciaSeccional[];
}
