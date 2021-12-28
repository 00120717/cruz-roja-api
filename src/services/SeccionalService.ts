import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Seccional } from '../entities/Seccional';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class SeccionalService {
  constructor(
    @InjectRepository(Seccional)
    protected seccionalRepository: Repository<Seccional>
  ) { }

  public async findById(id: number): Promise<Seccional | undefined> {
    return await this.seccionalRepository
    .createQueryBuilder('seccional')
    .where('seccional.id = :id', { id })
    .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.seccionalRepository
      .createQueryBuilder('seccional')
      .orderBy('seccional.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<Seccional[]> {
    return await this.seccionalRepository
        .createQueryBuilder('seccional')
        .getMany()
  }

  public async create(seccional: Seccional): Promise<Seccional> {
    return await this.seccionalRepository.save(seccional);
  }

  public async update(updateSeccional: Seccional): Promise<UpdateResult> {
    return await this.seccionalRepository.update(updateSeccional.id, updateSeccional);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.seccionalRepository.delete(id);
  }
}
