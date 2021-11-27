import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TipoVoluntario } from '../entities/TipoVoluntario';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class TipoVoluntarioService {
  constructor(
    @InjectRepository(TipoVoluntario)
    protected tipoVoluntarioRepository: Repository<TipoVoluntario>
  ) { }

  public async findById(id: number): Promise<TipoVoluntario | undefined> {
    return await this.tipoVoluntarioRepository.findOne(id);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.tipoVoluntarioRepository
      .createQueryBuilder('tipoVoluntario')
      .orderBy('tipoVoluntario.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<TipoVoluntario[]> {
    return await this.tipoVoluntarioRepository
        .createQueryBuilder('tipoVoluntario')
        .getMany()
  }

  public async create(tipoVoluntario: TipoVoluntario): Promise<TipoVoluntario> {
    return await this.tipoVoluntarioRepository.save(tipoVoluntario);
  }

  public async update(updateTipoVoluntario: TipoVoluntario): Promise<UpdateResult> {
    return await this.tipoVoluntarioRepository.update(updateTipoVoluntario.id, updateTipoVoluntario);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.tipoVoluntarioRepository.delete(id);
  }
}
