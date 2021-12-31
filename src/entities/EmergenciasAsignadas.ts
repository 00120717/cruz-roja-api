import { IsNotEmptyObject } from 'class-validator';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from "typeorm";
import { Emergencia } from './Emergencia';
import { Voluntario } from './Voluntario';

@Entity({ name: 'emergencias_asignadas' })
export class EmergenciasAsignadas {

    @PrimaryGeneratedColumn({ name: 'id_emergencia_asignada', type: 'bigint', unsigned: true })
    id: string;

    @Column({ name: 'union_emergencia', type: 'datetime' })
    unionEmergencia: Date

    @ManyToOne(
        (type) => Voluntario,
        (voluntario) => voluntario.emergenciasAsignadas
        , { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'id_voluntario' })
    @IsNotEmptyObject()
    voluntario: Voluntario;

    @ManyToOne(
        (type) => Emergencia,
        (emergencia) => emergencia.emergenciasAsignadas
    )
    @JoinColumn({ name: 'id_emergencia' })
    @IsNotEmptyObject()
    emergencia: Emergencia;
}
