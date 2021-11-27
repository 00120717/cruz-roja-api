import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Permiso } from "../entities/Permiso";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class PermisoService {
  constructor(
    @InjectRepository(Permiso)
    protected permisoRepository: Repository<Permiso>,
  ) {}

  public async findById(id: number): Promise<Permiso | undefined> {
    return await this.permisoRepository.findOne(id);
  }

  public async findByIds(ids: Array<number>): Promise<Permiso[]> {
    return await this.permisoRepository.findByIds(ids);
  }

  public async findByName(name: string): Promise<Permiso | undefined> {
    return await this.permisoRepository
      .createQueryBuilder('permiso')
      .where('permiso.nombre = :name', { name })
      .getOne();
  }

  public async listAll(): Promise<Permiso[]> {
    return await this.permisoRepository
        .createQueryBuilder('permiso')
        .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.permisoRepository
      .createQueryBuilder('permiso')
      .paginate(10);
  }

  public async create(permiso: Permiso): Promise<Permiso> {
    return await this.permisoRepository.save(permiso);
  }

  public async update(updatePermiso: Permiso): Promise<UpdateResult> {
    return await this.permisoRepository.update(updatePermiso.id, updatePermiso);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.permisoRepository.delete(id);
  }
}
