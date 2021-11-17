import { IsNotEmpty, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  //OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmergenciaRealizada } from './EmergenciaRealizada';
import { EmergenciasAsignadas } from './EmergenciasAsignadas';
import { TipoEmergencia } from './TipoEmergencia';

@Entity({ name: 'emergencia' })
export class Emergencia {
  @PrimaryGeneratedColumn({ name: 'id_emergencia', type: 'int', unsigned: true })
  id: string;

  @Column({ name: 'emergencia_codigo', type: 'text', unique: true })
  @IsNotEmpty()
  emergenciaCodigo: string;

  @Column({ name: 'emergencia_nombre', type: 'text' })
  @IsOptional()
  @IsString()
  emergenciaNombre: string;

  @Column({ name: 'emergencia_inicio', type: 'datetime' })
  emergenciaInicio: Date;

  @Column({ name: 'emergencia_final', type: 'datetime' })
  emergenciaFinal: Date;

  @Column({ name: 'emergencia_descripcion', type: 'varchar', length: '250' })
  emergenciaDescripcion: string;

  @ManyToOne(
    (type) => TipoEmergencia,
    (tipoEmergencia) => tipoEmergencia.emergencias
  )
  @JoinColumn({ name: 'id_tipo_emergencia' })
  @IsNotEmptyObject()
  tipoEmergencia: TipoEmergencia;

  @OneToMany(
    (type) => EmergenciaRealizada,
    (emergenciaRealizada) => emergenciaRealizada.emergencia
  )
  emergenciasRealizadas: EmergenciaRealizada[];

  @OneToMany(
    (type) => EmergenciasAsignadas,
    (emergenciasAsignadas) => emergenciasAsignadas.emergencia
  )
  emergenciasAsignadas: EmergenciasAsignadas[];

}
