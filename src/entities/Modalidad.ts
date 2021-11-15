import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voluntario } from './Voluntario';

@Entity({name:'modalidad'})
export class Modalidad {
  @PrimaryGeneratedColumn({ name: 'id_modalidad', type: 'int', unsigned: true })
  id: string;

  @Column({ name: 'modalidad', type: 'varchar', length: '20' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 20)
  modalidad: string;

  @OneToMany(
    (type) => Voluntario,
    (voluntario) => voluntario.modalidad
  )
  voluntarios: Voluntario[];
}
