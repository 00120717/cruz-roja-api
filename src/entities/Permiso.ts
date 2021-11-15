import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'permiso'})
export class Permiso {
  @PrimaryGeneratedColumn({ name: 'id_permiso', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'permiso_nombre', type: 'varchar', length: '50' })
  @IsNotEmpty()
  nombre: string;
}
