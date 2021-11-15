import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsOptional, IsString, Length } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  //OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Persona } from './Persona';
//import { SubjectToStudent } from './SubjectToStudent';

@Entity({name:'paciente'})
export class Paciente {
  @PrimaryGeneratedColumn({ name: 'id_paciente', type: 'bigint', unsigned: true  })
  id: number;

  @Column({ name: 'menor_edad', type: 'boolean', default: true })
  @IsNotEmpty()
  @IsBoolean()
  menorEdad: boolean;

  @Column({ name: 'alergias', type: 'text' })
  @IsOptional()
  @IsString()
  alergias: string;

  @Column({ name: 'telefono_encargado', type: 'varchar', length: '20' })
  @Length(0, 20)
  telefonoEncargado: string;

  @Column({ name: 'identificado', type: 'boolean', default: true })
  @IsNotEmpty()
  @IsBoolean()
  identificado: boolean;

  @Column({ name: 'condiciones_permanentes', type: 'text' })
  @IsOptional()
  @IsString()
  condicionesPermanentes: string;

  @Column({ name: 'identificador_personal', type: 'text' })
  @IsOptional()
  @IsString()
  identificadorPersonal: string;

  @Column({ name: 'fecha_creacion', type: 'datetime' })
  fechaCreacion: Date;
  
  @OneToOne((type) => Persona, { cascade: ['insert'], onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_persona' })
  @IsNotEmptyObject()
  persona: Persona;

  /*@OneToMany(
    (type) => SubjectToStudent,
    (subjectxstudent) => subjectxstudent.student
  )
  subjectQualifications: SubjectToStudent[];*/
}
