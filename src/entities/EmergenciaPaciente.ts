import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { Column, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from "typeorm";
import { EmergenciaRealizada } from './EmergenciaRealizada';
import { Paciente } from './Paciente';
import { VehiculoXEmergenciaPaciente } from './VehiculoXEmergenciaPaciente';

@Entity({ name: 'emergencia_paciente' })
export class EmergenciaPaciente {

    @PrimaryGeneratedColumn({ name: 'id_emergencia_paciente', type: 'bigint', unsigned: true })
    id: string;

    @Column({ name: 'tratamientos_realizados', type: 'text' })
    @IsNotEmpty()
    @IsString()
    tratamientosRealizados: string;

    @Column({ name: 'diagnostico', type: 'text' })
    @IsNotEmpty()
    @IsString()
    diagnostico: string;

    @Column({ name: 'prenda_superior', type: 'text' })
    @IsNotEmpty()
    @IsString()
    prendaSuperior: string;

    @Column({ name: 'prenda_inferior', type: 'text' })
    @IsNotEmpty()
    @IsString()
    prendaInferior: string;

    @Column({ name: 'calzado', type: 'text' })
    @IsNotEmpty()
    @IsString()
    calzado: string;

    @Column({ name: 'estatura', type: 'text' })
    @IsNotEmpty()
    @IsString()
    estatura: string;

    @Column({ name: 'pelo_color_estilo', type: 'text' })
    @IsNotEmpty()
    @IsString()
    peloColorEstilo: string;

    @Column({ name: 'comentario_señal_especial', type: 'text' })
    @IsNotEmpty()
    @IsString()
    comentarioSennalEspecial: string;

    @Column({ name: 'fecha_atencion_inicial', type: 'datetime' })
    fechaAtencionInicial: Date

    @Column({ name: 'fecha_despacho', type: 'datetime' })
    fechaDespacho: Date

    @Column({ name: 'fecha_ingreso_hospital', type: 'datetime' })
    fechaIngresoHospital: Date

    @ManyToOne(
        (type) => EmergenciaRealizada,
        (emergenciaRealizada) => emergenciaRealizada.emergenciaPaciente
        , { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'id_emergencia_realizada' })
    @IsNotEmptyObject()
    emergenciaRealizada: EmergenciaRealizada;

    @ManyToOne(
        (type) => Paciente,
        (paciente) => paciente.emergenciaPaciente
    )
    @JoinColumn({ name: 'id_paciente' })
    @IsNotEmptyObject()
    paciente: Paciente;

    @OneToMany(
        (type) => VehiculoXEmergenciaPaciente,
        (vehiculoXEmergenciaPaciente) => vehiculoXEmergenciaPaciente.emergenciaPaciente
    )
    vehiculoXEmergenciaPaciente: VehiculoXEmergenciaPaciente[];
}
