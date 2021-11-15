import { IsNotEmpty, IsNotEmptyObject, IsOptional, IsString } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TipoEmergencia } from './TipoEmergencia';

@Entity({name:'emergencia'})
export class Emergencia {
  @PrimaryGeneratedColumn({ name: 'id_emergencia', type: 'int', unsigned: true  })
  id: number;

  @Column({ name: 'emergencia_codigo', type: 'text', unique: true })
  @IsNotEmpty()
  emergenciaCodigo: string;

  @Column({ name: 'emergencia_nombre', type: 'text' })
  @IsOptional()
  @IsString()
  emergenciaNombre: string;

  @Column({ name: 'voluntario_codigo', type: 'varchar', length: '15' })
  @IsOptional()
  @IsString()
  voluntarioCodigo: string;

  @ManyToOne(
    (type) => TipoEmergencia,
    (tipoEmergencia) => tipoEmergencia.emergencias
  )
  @JoinColumn({ name: 'id_tipo_emergencia' })
  @IsNotEmptyObject()
  tipoEmergencia: TipoEmergencia;

  @OneToMany(
    (type) => SubjectToStudent,
    (subjectxstudent) => subjectxstudent.student
  )
  subjectQualifications: SubjectToStudent[];
}
