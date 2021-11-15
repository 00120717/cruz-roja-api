import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TipoSede } from '../entities/TipoSede';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class TipoSedeService {
  constructor(
    @InjectRepository(TipoSede)
    protected sedeRepository: Repository<TipoSede>
  ) { }

  public async findById(id: number): Promise<TipoSede | undefined> {
    return await this.sedeRepository.findOne(id);
  }

  public async findActive(): Promise<TipoSede | undefined> {
    return await this.sedeRepository
      .createQueryBuilder('sede')
      .where('sede.active = :active', { active: true })
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.sedeRepository
      .createQueryBuilder('sede')
      .orderBy('sede.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<TipoSede[]> {
    return await this.sedeRepository
        .createQueryBuilder('sede')
        .getMany()
  }

  public async create(sede: TipoSede): Promise<TipoSede> {
    return await this.sedeRepository.save(sede);
  }

  public async update(newSede: TipoSede): Promise<UpdateResult> {
    return await this.sedeRepository.update(newSede.id, newSede);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.sedeRepository.delete(id);
  }
}
