import { IsNotEmptyObject, IsOptional, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TipoVoluntario } from './TipoVoluntario';
import { Estado } from './Estado';
import { Modalidad } from './Modalidad';
import { CuerpoFilial } from './CuerpoFilial';
import { Sede } from './Sede';
import { Persona } from './Persona';
import { EmergenciasAsignadas } from './EmergenciasAsignadas';
import { EmergenciaRealizada } from './EmergenciaRealizada';
import { CursoXVoluntario } from './CursoXVoluntario';
import { VehiculoXEmergenciaPaciente } from './VehiculoXEmergenciaPaciente';

@Entity({ name: 'voluntario' })
@Unique(['voluntarioCodigoCarnet'])
export class Voluntario {
  @PrimaryGeneratedColumn({ name: 'id_voluntario', type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'fecha_inicio', type: 'datetime' })
  @IsOptional()
  fechaInicio: Date;

  @Column({ name: 'voluntario_codigo_carnet', type: 'varchar', length: '15' })
  @IsOptional()
  @IsString()
  voluntarioCodigoCarnet: string;

  @OneToOne((type) => Persona, { cascade: ['insert'], onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_persona' })
  @IsNotEmptyObject()
  persona: Persona;

  @ManyToOne(
    (type) => TipoVoluntario,
    (tipoVoluntario) => tipoVoluntario.voluntarios
  )
  @JoinColumn({ name: 'id_tipo_voluntario' })
  @IsNotEmptyObject()
  tipoVoluntario: TipoVoluntario;

  @ManyToOne(
    (type) => Estado,
    (estado) => estado.voluntarios
  )
  @JoinColumn({ name: 'id_estado' })
  @IsNotEmptyObject()
  estado: Estado;

  @ManyToOne(
    (type) => Modalidad,
    (modalidad) => modalidad.voluntarios
  )
  @JoinColumn({ name: 'id_modalidad' })
  @IsNotEmptyObject()
  modalidad: Modalidad;

  @ManyToOne(
    (type) => CuerpoFilial,
    (cuerpoFilial) => cuerpoFilial.voluntarios
  )
  @JoinColumn({ name: 'id_cuerpo_filial' })
  @IsNotEmptyObject()
  cuerpoFilial: CuerpoFilial;

  @ManyToOne(
    (type) => Sede,
    (sede) => sede.voluntarios
  )
  @JoinColumn({ name: 'id_sede' })
  @IsNotEmptyObject()
  sede: Sede;

  @OneToMany(
    (type) => EmergenciasAsignadas,
    (emergenciasAsignadas) => emergenciasAsignadas.voluntario
  )
  emergenciasAsignadas: EmergenciasAsignadas[];

  @ManyToMany(
    (type) => EmergenciaRealizada,
    (emergenciasRealizadas) => emergenciasRealizadas.voluntarios
  )
  @JoinTable({
    name: 'emergencia_realizadaXvoluntario',
    joinColumn: {
      name: 'id_voluntario',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_emergencia_realizada',
      referencedColumnName: 'id'
    }
  })
  emergenciasRealizadas: EmergenciaRealizada[];

  @OneToMany(
    (type) => CursoXVoluntario,
    (cursoXVoluntario) => cursoXVoluntario.voluntario
  )
  cursoXVoluntario: CursoXVoluntario[];

  @OneToMany(
    (type) => VehiculoXEmergenciaPaciente,
    (vehiculoXEmergenciaPaciente) => vehiculoXEmergenciaPaciente.voluntario
  )
  vehiculoXEmergenciaPaciente: VehiculoXEmergenciaPaciente[];
}
