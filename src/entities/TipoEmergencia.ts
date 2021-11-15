import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Emergencia } from './Emergencia';

@Entity({name:'tipo_emergencia'})
export class TipoEmergencia {
  @PrimaryGeneratedColumn({ name: 'id_tipo_emergencia', type: 'int', unsigned: true })
  id: string;

  @Column({ name: 'tipo_emergencia', type: 'varchar', length: '50' })
  @IsNotEmpty()
  @IsString()
  @Length(0, 50)
  tipoEmergencia: string;

  @OneToMany(
    (type) => Emergencia,
    (emergencia) => emergencia.tipoEmergencia
  )
  emergencias: Emergencia[];
}
