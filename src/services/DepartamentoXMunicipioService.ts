import { DeleteResult, Repository } from 'typeorm';
import { DepartamentoXMunicipio } from '../entities/DepartamentoXMunicipio';
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class DepartamentoXMunicipioService {
  constructor(
    @InjectRepository(DepartamentoXMunicipio)
    protected departamentoXmunicipioRepository: Repository<DepartamentoXMunicipio>,
  ) { }

  public async findById(id: number): Promise<DepartamentoXMunicipio | undefined> {
    return await this.departamentoXmunicipioRepository.createQueryBuilder('departamentoXmunicipio')
        .where('departamentoXmunicipio.id = :id', { id })
        .getOne();
  }

  public async findByIdWithRelations(id: number): Promise<DepartamentoXMunicipio | undefined> {
    return await this.departamentoXmunicipioRepository
      .createQueryBuilder('departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .where('departamentoXmunicipio.id = :id', { id })
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.departamentoXmunicipioRepository
      .createQueryBuilder('departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .paginate(10);
  }

  public async listAll(): Promise<DepartamentoXMunicipio[]> {
    return await this.departamentoXmunicipioRepository
        .createQueryBuilder('departamentoXmunicipio')
        .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
        .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
        .getMany();
  }

  public async create(departamentoXmunicipio: DepartamentoXMunicipio): Promise<DepartamentoXMunicipio> {
    return await this.departamentoXmunicipioRepository.save(departamentoXmunicipio);
  }

  public async update(updateDepartamentoXmunicipio: DepartamentoXMunicipio): Promise<DepartamentoXMunicipio> {
    return await this.departamentoXmunicipioRepository.save(updateDepartamentoXmunicipio);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.departamentoXmunicipioRepository.delete(id);
  }
}
