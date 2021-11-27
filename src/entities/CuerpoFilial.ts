import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Voluntario } from './Voluntario';

@Entity({ name: 'cuerpo_filial' })
export class CuerpoFilial {
  @PrimaryGeneratedColumn({ name: 'id_cuerpo_filial', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'nombre_cuerpo_filial', type: 'varchar', length: '40' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 40)
  nombreCuerpoFilial: string;

  @Column({ name: 'encargado', type: 'varchar', length: '40' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 40)
  encargado: string;

  @OneToMany(
    (type) => Voluntario,
    (voluntario) => voluntario.cuerpoFilial
  )
  voluntarios: Voluntario[];
}
