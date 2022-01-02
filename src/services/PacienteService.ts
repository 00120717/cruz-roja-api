import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Paciente } from '../entities/Paciente';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    protected pacienteRepository: Repository<Paciente>
  ) { }

  public async findById(id: string): Promise<Paciente | undefined> {
    return await this.pacienteRepository
    .createQueryBuilder('paciente')
    .leftJoinAndSelect('paciente.persona', 'persona')
    .where('paciente.id = :id', { id })
    .getOne();
  }

  public async findByIds(ids: Array<string>): Promise<Paciente[]> {
    return await this.pacienteRepository.findByIds(ids);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.pacienteRepository
      .createQueryBuilder('paciente')
      .leftJoinAndSelect('paciente.persona', 'persona')
      .orderBy('paciente.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<Paciente[]> {
    return await this.pacienteRepository
        .createQueryBuilder('paciente')
        .leftJoinAndSelect('paciente.persona', 'persona')
        .getMany()
  }

  public async create(paciente: Paciente): Promise<Paciente> {
    return await this.pacienteRepository.save(paciente);
  }

  public async update(updateSeccional: Paciente): Promise<UpdateResult> {
    return await this.pacienteRepository.update(updateSeccional.id, updateSeccional);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.pacienteRepository.delete(id);
  }
}
