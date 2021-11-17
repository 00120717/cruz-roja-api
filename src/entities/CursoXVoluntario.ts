import { IsNotEmptyObject } from 'class-validator';
import { JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from "typeorm";
import { Curso } from './Curso';
import { DetalleCurso } from './DetalleCurso';
import { Voluntario } from './Voluntario';

@Entity({ name: 'cursoXvoluntario' })
export class CursoXVoluntario {

    @PrimaryGeneratedColumn({ name: 'id_cursoXvoluntario', type: 'bigint', unsigned: true })
    id: string;

    @ManyToOne(
        (type) => Voluntario,
        (voluntario) => voluntario.cursoXVoluntario
        , { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'id_voluntario' })
    @IsNotEmptyObject()
    voluntario: Voluntario;

    @ManyToOne(
        (type) => Curso,
        (curso) => curso.cursosXVoluntarios
    )
    @JoinColumn({ name: 'id_curso' })
    @IsNotEmptyObject()
    curso: Curso;

    @OneToMany(
        (type) => DetalleCurso,
        (detalleCurso) => detalleCurso.cursoXVoluntario
    )
    detallesCurso: DetalleCurso[];
}
