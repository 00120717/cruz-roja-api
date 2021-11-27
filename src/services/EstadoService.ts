import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Estado } from '../entities/Estado';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class EstadoService {
  constructor(
    @InjectRepository(Estado)
    protected estadoRepository: Repository<Estado>
  ) { }

  public async findById(id: number): Promise<Estado | undefined> {
    return await this.estadoRepository.findOne(id);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.estadoRepository
      .createQueryBuilder('estado')
      .orderBy('estado.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<Estado[]> {
    return await this.estadoRepository
        .createQueryBuilder('estado')
        .getMany()
  }

  public async create(estado: Estado): Promise<Estado> {
    return await this.estadoRepository.save(estado);
  }

  public async update(updateEstado: Estado): Promise<UpdateResult> {
    return await this.estadoRepository.update(updateEstado.id, updateEstado);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.estadoRepository.delete(id);
  }
}
