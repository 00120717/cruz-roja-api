import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voluntario } from './Voluntario';

@Entity({name:'hospital'})
export class Hospital {
  @PrimaryGeneratedColumn({ name: 'id_hospital', type: 'int', unsigned: true })
  id: string;

  @Column({ name: 'nombre_hospital', type: 'text' })
  @IsNotEmpty()
  @IsString()
  nombreHospital: string;

  @Column({ name: 'codigo_hospital', type: 'text' })
  @IsNotEmpty()
  @IsString()
  codigoHospital: string;

  @Column({ name: 'fecha_creacion', type: 'datetime' })
  fechaCreacion: Date;

  @OneToMany(
    (type) => Voluntario,
    (voluntario) => voluntario.cuerpoFilial
  )
  voluntarios: Voluntario[];
}
