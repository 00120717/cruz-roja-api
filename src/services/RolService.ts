import { DeleteResult, Repository } from 'typeorm';
import { Rol } from '../entities/Rol';
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    protected rolRepository: Repository<Rol>,
  ) { }

  public async findById(id: number): Promise<Rol | undefined> {
    return await this.rolRepository.createQueryBuilder('rol')
        .where('rol.id = :id', { id })
        .getOne();
  }

  public async findByIdWithRelations(id: number): Promise<Rol | undefined> {
    return await this.rolRepository
      .createQueryBuilder('rol')
      .leftJoinAndSelect('rol.permisos', 'permisos')
      .where('rol.id = :id', { id })
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.rolRepository
      .createQueryBuilder('rol')
      .leftJoinAndSelect('rol.permisos', 'permisos')
      .paginate(10);
  }

  public async listAll(): Promise<Rol[]> {
    return await this.rolRepository
        .createQueryBuilder('rol')
        .getMany();
  }

  public async create(rol: Rol): Promise<Rol> {
    return await this.rolRepository.save(rol);
  }

  public async update(updateRol: Rol): Promise<Rol> {
    return await this.rolRepository.save(updateRol);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.rolRepository.delete(id);
  }
}
