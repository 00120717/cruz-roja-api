import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TipoEmergencia } from '../entities/TipoEmergencia';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class TipoEmergenciaService {
  constructor(
    @InjectRepository(TipoEmergencia)
    protected tipoEmergenciaRepository: Repository<TipoEmergencia>
  ) { }

  public async findById(id: number): Promise<TipoEmergencia | undefined> {
    return await this.tipoEmergenciaRepository
    .createQueryBuilder('tipoEmergencia')
    .where('tipoEmergencia.id = :id', { id })
    .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.tipoEmergenciaRepository
      .createQueryBuilder('tipoEmergencia')
      .orderBy('tipoEmergencia.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<TipoEmergencia[]> {
    return await this.tipoEmergenciaRepository
        .createQueryBuilder('tipoEmergencia')
        .getMany()
  }

  public async create(tipoEmergencia: TipoEmergencia): Promise<TipoEmergencia> {
    return await this.tipoEmergenciaRepository.save(tipoEmergencia);
  }

  public async update(updateTipoEmergencia: TipoEmergencia): Promise<UpdateResult> {
    return await this.tipoEmergenciaRepository.update(updateTipoEmergencia.id, updateTipoEmergencia);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.tipoEmergenciaRepository.delete(id);
  }
}
