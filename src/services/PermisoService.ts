import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Permiso } from "../entities/Permiso";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class PermisoService {
  constructor(
    @InjectRepository(Permiso)
    protected permissionRepository: Repository<Permiso>,
  ) {}

  public async findById(id: number): Promise<Permiso | undefined> {
    return await this.permissionRepository.findOne(id);
  }

  public async findByIds(ids: Array<number>): Promise<Permiso[]> {
    return await this.permissionRepository.findByIds(ids);
  }

  public async findByName(name: string): Promise<Permiso | undefined> {
    return await this.permissionRepository
      .createQueryBuilder('permission')
      .where('permission.name = :name', { name })
      .getOne();
  }

  public async listAll(): Promise<Permiso[]> {
    return await this.permissionRepository
        .createQueryBuilder('permission')
        .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.permissionRepository
      .createQueryBuilder('permission')
      .paginate(10);
  }

  public async create(permission: Permiso): Promise<Permiso> {
    return await this.permissionRepository.save(permission);
  }

  public async update(newPermission: Permiso): Promise<UpdateResult> {
    return await this.permissionRepository.update(newPermission.id, newPermission);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.permissionRepository.delete(id);
  }
}
