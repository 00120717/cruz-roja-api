import { IsNotEmptyObject } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { Entity } from "typeorm";
import { EmergenciaPaciente } from './EmergenciaPaciente';
import { Hospital } from './Hospital';
import { Vehiculo } from './Vehiculo';
import { Voluntario } from './Voluntario';

@Entity({ name: 'vehiculoXemergencia_paciente' })
export class VehiculoXEmergenciaPaciente {

    @Column({ name: 'hora_salida', type: 'datetime' })
    horaSalida: Date

    @Column({ name: 'hora_regreso', type: 'datetime' })
    horaRegreso: Date

    @ManyToOne(
        (type) => Voluntario,
        (voluntario) => voluntario.vehiculoXEmergenciaPaciente
        , { onDelete: 'CASCADE', primary: true }
    )
    @JoinColumn({ name: 'id_voluntario' })
    @IsNotEmptyObject()
    voluntario: Voluntario;

    @ManyToOne(
        (type) => EmergenciaPaciente,
        (emergenciaPaciente) => emergenciaPaciente.vehiculoXEmergenciaPaciente
        , { primary: true }
    )
    @JoinColumn({ name: 'id_emergencia_paciente' })
    @IsNotEmptyObject()
    emergenciaPaciente: EmergenciaPaciente;

    @ManyToOne(
        (type) => Vehiculo,
        (vehiculo) => vehiculo.vehiculoXEmergenciaPaciente
        , { onDelete: 'CASCADE', primary: true }
    )
    @JoinColumn({ name: 'id_vehiculo' })
    @IsNotEmptyObject()
    vehiculo: Vehiculo;

    @ManyToOne(
        (type) => Hospital,
        (hospital) => hospital.vehiculoXEmergenciaPaciente
        , { onDelete: 'CASCADE', primary: true }
    )
    @JoinColumn({ name: 'id_hospital' })
    @IsNotEmptyObject()
    hospital: Hospital;
}
