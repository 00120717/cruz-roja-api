import { IsNotEmptyObject } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EmergenciaRealizada } from './EmergenciaRealizada';
import { Seccional } from './Seccional';

@Entity({ name: 'emergencia_seccional' })
export class EmergenciaSeccional {
  @Column({ name: 'fecha_inicio', type: 'datetime' })
  fechaInicio: Date

  @ManyToOne(
    (type) => EmergenciaRealizada,
    (emergenciaRealizada) => emergenciaRealizada.emergenciaSeccional
    , { onDelete: 'CASCADE', primary: true }
  )
  @JoinColumn({ name: 'id_emergencia_realizada' })
  @IsNotEmptyObject()
  emergenciaRealizada: EmergenciaRealizada;

  @ManyToOne(
    (type) => Seccional,
    (seccional) => seccional.emergenciaSeccional
    , { primary: true }
  )
  @JoinColumn({ name: 'id_seccional' })
  @IsNotEmptyObject()
  seccional: Seccional;
}
