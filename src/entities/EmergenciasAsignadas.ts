import { IsNotEmptyObject } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { Entity } from "typeorm";
import { Emergencia } from './Emergencia';
import { Voluntario } from './Voluntario';

@Entity({ name: 'emergencias_asignadas' })
export class EmergenciasAsignadas {

    @Column({ name: 'union_emergencia', type: 'datetime' })
    unionEmergencia: Date

    @ManyToOne(
        (type) => Voluntario,
        (voluntario) => voluntario.emergenciasAsignadas
        , { onDelete: 'CASCADE', primary: true }
    )
    @JoinColumn({ name: 'id_voluntario' })
    @IsNotEmptyObject()
    voluntario: Voluntario;

    @ManyToOne(
        (type) => Emergencia,
        (emergencia) => emergencia.emergenciasAsignadas
        , { primary: true }
    )
    @JoinColumn({ name: 'id_emergencia' })
    @IsNotEmptyObject()
    emergencia: Emergencia;
}
