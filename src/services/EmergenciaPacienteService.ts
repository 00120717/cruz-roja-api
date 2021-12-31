import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { EmergenciaPaciente } from "../entities/EmergenciaPaciente";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class EmergenciaPacienteService {
  constructor(
    @InjectRepository(EmergenciaPaciente)
    protected emergenciaRepository: Repository<EmergenciaPaciente>,
  ) {}

  public async findById(id: number): Promise<EmergenciaPaciente | undefined> {
    return await this.emergenciaRepository.findOne(id);
  }

  public async findByIds(ids: Array<number>): Promise<EmergenciaPaciente[]> {
    return await this.emergenciaRepository.findByIds(ids);
  }

  public async findByName(name: string): Promise<EmergenciaPaciente | undefined> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergencia')
      .where('emergencia.emergenciaNombre = :name', { name })
      .getOne();
  }

  public async listAll(): Promise<EmergenciaPaciente[]> {
    return await this.emergenciaRepository
        .createQueryBuilder('emergencia')
        .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergencia')
      .paginate(10);
  }

  public async create(emergencia: EmergenciaPaciente): Promise<EmergenciaPaciente> {
    return await this.emergenciaRepository.save(emergencia);
  }

  public async update(updateEmergencia: EmergenciaPaciente): Promise<UpdateResult> {
    return await this.emergenciaRepository.update(updateEmergencia.id, updateEmergencia);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.emergenciaRepository.delete(id);
  }
}
