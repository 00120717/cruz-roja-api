import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TipoSede } from '../entities/TipoSede';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class TipoSedeService {
  constructor(
    @InjectRepository(TipoSede)
    protected tipoSedeRepository: Repository<TipoSede>
  ) { }

  public async findById(id: number): Promise<TipoSede | undefined> {
    return await this.tipoSedeRepository.createQueryBuilder('tipoSede')
    .where('tipoSede.id = :id', { id })
    .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.tipoSedeRepository
      .createQueryBuilder('tipoSede')
      .orderBy('tipoSede.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<TipoSede[]> {
    return await this.tipoSedeRepository
        .createQueryBuilder('tipoSede')
        .getMany()
  }

  public async create(tipoSede: TipoSede): Promise<TipoSede> {
    return await this.tipoSedeRepository.save(tipoSede);
  }

  public async update(updateTipoSede: TipoSede): Promise<UpdateResult> {
    return await this.tipoSedeRepository.update(updateTipoSede.id, updateTipoSede);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.tipoSedeRepository.delete(id);
  }
}
