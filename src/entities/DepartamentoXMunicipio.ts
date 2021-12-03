import { IsNotEmptyObject } from 'class-validator';
import { JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from "typeorm";
import { Departamento } from './Departamento';
import { Municipio } from './Municipio';
import { Sede } from './Sede';

@Entity({ name: 'departamentoXmunicipio' })
export class DepartamentoXMunicipio {

    @PrimaryGeneratedColumn({ name: 'id_departamentoxmunicipio', type: 'int', unsigned: true })
    id: string;

    @ManyToOne(
        (type) => Departamento,
        (departamento) => departamento.departamentoXmunicipio
        , { onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'id_departamento' })
    @IsNotEmptyObject()
    departamento: Departamento;

    @ManyToOne(
        (type) => Municipio,
        (municipio) => municipio.departamentoXmunicipio
    )
    @JoinColumn({ name: 'id_municipio' })
    @IsNotEmptyObject()
    municipio: Municipio;

    @OneToMany(
        (type) => Sede,
        (sede) => sede.departamentoXmunicipio
    )
    sede: Sede[];
}
