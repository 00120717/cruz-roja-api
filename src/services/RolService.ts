import { DeleteResult, Repository } from 'typeorm';
import { Rol } from '../entities/Rol';
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    protected roleRepository: Repository<Rol>,
  ) { }

  public async findById(id: number): Promise<Rol | undefined> {
    return await this.roleRepository.createQueryBuilder('role')
        .where('role.id = :id', { id })
        .getOne();
  }

  public async findByIdWithRelations(id: number): Promise<Rol | undefined> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .where('role.id = :id', { id })
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .paginate(10);
  }

  public async listAll(): Promise<Rol[]> {
    return await this.roleRepository
        .createQueryBuilder('role')
        .getMany();
  }

  public async create(role: Rol): Promise<Rol> {
    return await this.roleRepository.save(role);
  }

  public async update(newRole: Rol): Promise<Rol> {
    return await this.roleRepository.save(newRole);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.roleRepository.delete(id);
  }
}
