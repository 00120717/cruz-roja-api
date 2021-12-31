import { DeleteResult, Repository } from 'typeorm';
import { EmergenciaSeccional } from '../entities/EmergenciaSeccional';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class EmergenciaSeccionalService {
  constructor(
    @InjectRepository(EmergenciaSeccional)
    protected emergenciaSeccionalRepository: Repository<EmergenciaSeccional>
  ) { }

  public async findById(id: number): Promise<EmergenciaSeccional | undefined> {
    return await this.emergenciaSeccionalRepository
    .createQueryBuilder('seccional')
    .where('seccional.id = :id', { id })
    .getOne();
  }

  public async findByIds(ids: Array<number>): Promise<EmergenciaSeccional[]> {
    return await this.emergenciaSeccionalRepository.findByIds(ids);
  }

  public async create(seccional: EmergenciaSeccional): Promise<EmergenciaSeccional> {
    return await this.emergenciaSeccionalRepository.save(seccional);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.emergenciaSeccionalRepository.delete(id);
  }
}
