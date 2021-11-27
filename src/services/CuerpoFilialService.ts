import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CuerpoFilial } from '../entities/CuerpoFilial';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class CuerpoFilialService {
  constructor(
    @InjectRepository(CuerpoFilial)
    protected cuerpoFilialRepository: Repository<CuerpoFilial>
  ) { }

  public async findById(id: number): Promise<CuerpoFilial | undefined> {
    return await this.cuerpoFilialRepository.findOne(id);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.cuerpoFilialRepository
      .createQueryBuilder('cuerpoFilial')
      .orderBy('cuerpoFilial.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<CuerpoFilial[]> {
    return await this.cuerpoFilialRepository
        .createQueryBuilder('cuerpoFilial')
        .getMany()
  }

  public async create(cuerpoFilial: CuerpoFilial): Promise<CuerpoFilial> {
    return await this.cuerpoFilialRepository.save(cuerpoFilial);
  }

  public async update(updateCuerpoFilial: CuerpoFilial): Promise<UpdateResult> {
    return await this.cuerpoFilialRepository.update(updateCuerpoFilial.id, updateCuerpoFilial);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.cuerpoFilialRepository.delete(id);
  }
}
