import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'emergencia_seccional'})
export class EmergenciaSeccional {
  @PrimaryGeneratedColumn({ name: 'id_emergencia_realizada', type: 'int', unsigned: true  })
  id: number;
}
