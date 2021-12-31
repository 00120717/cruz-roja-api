import { IsNotEmptyObject, IsOptional, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Emergencia } from './Emergencia';
import { EmergenciaPaciente } from './EmergenciaPaciente';
import { EmergenciaSeccional } from './EmergenciaSeccional';
import { Voluntario } from './Voluntario';

@Entity({ name: 'emergencia_realizada' })
export class EmergenciaRealizada {
  
  @PrimaryGeneratedColumn({ name: 'id_emergencia_realizada', type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'identificador_formulario', type: 'bigint', unsigned: true })
  @IsOptional()
  identificadorFormulario: string;

  @Column({ name: 'ubicacion_exacta', type: 'text' })
  @IsOptional()
  @IsString()
  ubicacionExacta: string;

  @Column({ name: 'fecha_realizada', type: 'datetime' })
  fechaRealizada: Date;

  @Column({ name: 'fecha_hora_llamada', type: 'datetime' })
  fechaHoraLlamada: Date;

  @Column({ name: 'telefono', type: 'varchar', length: '20' })
  telefono: string;

  @Column({ name: 'emisor_emergencia', type: 'text' })
  @IsOptional()
  @IsString()
  emisorEmergencia: string;

  @Column({ name: 'comentario', type: 'text' })
  @IsOptional()
  @IsString()
  comentario: string;

  @ManyToOne(
    (type) => Emergencia,
    (emergencia) => emergencia.emergenciasRealizadas
  )
  @JoinColumn({ name: 'id_emergencia' })
  @IsNotEmptyObject()
  emergencia: Emergencia;

  @ManyToMany(
    (type) => Voluntario,
    (voluntarios) => voluntarios.emergenciasRealizadas
  )
  voluntarios: Voluntario[];

  @OneToMany(
    (type) => EmergenciaSeccional,
    (emergenciaSeccional) => emergenciaSeccional.emergenciaRealizada
  )
  emergenciaSeccional: EmergenciaSeccional[];

  @OneToMany(
    (type) => EmergenciaPaciente,
    (emergenciaPaciente) => emergenciaPaciente.emergenciaRealizada
  )
  emergenciaPaciente: EmergenciaPaciente[];
}
