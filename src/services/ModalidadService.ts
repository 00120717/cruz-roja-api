import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Modalidad } from '../entities/Modalidad';
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class ModalidadService {
  constructor(
    @InjectRepository(Modalidad)
    protected modalidadRepository: Repository<Modalidad>
  ) { }

  public async findById(id: number): Promise<Modalidad | undefined> {
    return await this.modalidadRepository.findOne(id);
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.modalidadRepository
      .createQueryBuilder('modalidad')
      .orderBy('modalidad.id', 'ASC')
      .paginate(10);
  }

  public async listAll(): Promise<Modalidad[]> {
    return await this.modalidadRepository
        .createQueryBuilder('modalidad')
        .getMany()
  }

  public async create(modalidad: Modalidad): Promise<Modalidad> {
    return await this.modalidadRepository.save(modalidad);
  }

  public async update(updateModalidad: Modalidad): Promise<UpdateResult> {
    return await this.modalidadRepository.update(updateModalidad.id, updateModalidad);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.modalidadRepository.delete(id);
  }
}
