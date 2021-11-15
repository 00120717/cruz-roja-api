import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voluntario } from './Voluntario';

@Entity({name:'vehiculo'})
export class Vehiculo {
  @PrimaryGeneratedColumn({ name: 'id_vehiculo', type: 'int', unsigned: true })
  id: string;

  @Column({ name: 'vehiculo', type: 'text' })
  @IsNotEmpty()
  @IsString()
  vehiculo: string;

  @Column({ name: 'kilometraje', type: 'text' })
  @IsNotEmpty()
  @IsString()
  kilometraje: string;

  @Column({ name: 'fecha_creacion', type: 'datetime' })
  fechaCreacion: Date;

  @OneToMany(
    (type) => Voluntario,
    (voluntario) => voluntario.cuerpoFilial
  )
  voluntarios: Voluntario[];
}
