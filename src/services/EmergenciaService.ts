import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Emergencia } from "../entities/Emergencia";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class EmergenciaService {
  constructor(
    @InjectRepository(Emergencia)
    protected emergenciaRepository: Repository<Emergencia>,
  ) {}

  public async findById(id: number): Promise<Emergencia | undefined> {
    return await this.emergenciaRepository
    .createQueryBuilder('emergencia')
    .leftJoinAndSelect('emergencia.tipoEmergencia', 'tipoEmergencia')
    .where('emergencia.id = :id', { id })
    .getOne();
  }

  public async findByIds(ids: Array<number>): Promise<Emergencia[]> {
    return await this.emergenciaRepository.findByIds(ids);
  }

  public async findByName(name: string): Promise<Emergencia | undefined> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergencia')
      .leftJoinAndSelect('emergencia.tipoEmergencia', 'tipoEmergencia')
      .where('emergencia.emergenciaNombre = :name', { name })
      .getOne();
  }

  public async listAll(): Promise<Emergencia[]> {
    return await this.emergenciaRepository
        .createQueryBuilder('emergencia')
        .leftJoinAndSelect('emergencia.tipoEmergencia', 'tipoEmergencia')
        .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergencia')
      .leftJoinAndSelect('emergencia.tipoEmergencia', 'tipoEmergencia')
      .paginate(10);
  }

  public async create(emergencia: Emergencia): Promise<Emergencia> {
    return await this.emergenciaRepository.save(emergencia);
  }

  public async update(updateEmergencia: Emergencia): Promise<UpdateResult> {
    return await this.emergenciaRepository.update(updateEmergencia.id, updateEmergencia);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.emergenciaRepository.delete(id);
  }
}
