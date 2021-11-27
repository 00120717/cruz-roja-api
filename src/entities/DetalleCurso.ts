import { IsNotEmpty, IsString, IsNotEmptyObject, IsBoolean } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CursoXVoluntario } from './CursoXVoluntario';

@Entity({ name: 'detalle_curso' })
export class DetalleCurso {
  @PrimaryGeneratedColumn({ name: 'id_detalle_curso', type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'aprovado', type: 'boolean', default: false })
  @IsNotEmpty()
  @IsBoolean()
  aprovado: boolean;

  @Column({ name: 'creado_en', type: 'datetime' })
  creadoEn: Date;

  @Column({ name: 'actualizado_en', type: 'datetime' })
  actualizadoEn: Date;

  @Column({ name: 'actualizado_por', type: 'text' })
  @IsNotEmpty()
  @IsString()
  actualizadoPor: string;


  @ManyToOne(
    (type) => CursoXVoluntario,
    (cursoXVoluntario) => cursoXVoluntario.detallesCurso
  )
  @JoinColumn({ name: 'id_cursoXvoluntario' })
  @IsNotEmptyObject()
  cursoXVoluntario: CursoXVoluntario;
}
