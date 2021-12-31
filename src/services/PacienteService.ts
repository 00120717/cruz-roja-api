import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Paciente } from '../entities/Paciente';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    protected seccionalRepository: Repository<Paciente>
  ) { }

  public async findById(id: number): Promise<Paciente | undefined> {
    return await this.seccionalRepository
    .createQueryBuilder('seccional')
    .where('seccional.id = :id', { id })
    .getOne();
  }

  public async findByIds(ids: Array<number>): Promise<Paciente[]> {
    return await this.seccionalRepository.findByIds(ids);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.seccionalRepository
      .createQueryBuilder('seccional')
      .orderBy('seccional.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<Paciente[]> {
    return await this.seccionalRepository
        .createQueryBuilder('seccional')
        .getMany()
  }

  public async create(seccional: Paciente): Promise<Paciente> {
    return await this.seccionalRepository.save(seccional);
  }

  public async update(updateSeccional: Paciente): Promise<UpdateResult> {
    return await this.seccionalRepository.update(updateSeccional.id, updateSeccional);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.seccionalRepository.delete(id);
  }
}
