import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Vehiculo } from "../entities/Vehiculo";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    protected vehiculoRepository: Repository<Vehiculo>,
  ) {}

  public async findById(id: number): Promise<Vehiculo | undefined> {
    return await this.vehiculoRepository.findOne(id);
  }

  public async findByIds(ids: Array<number>): Promise<Vehiculo[]> {
    return await this.vehiculoRepository.findByIds(ids);
  }

  public async findByName(name: string): Promise<Vehiculo | undefined> {
    return await this.vehiculoRepository
      .createQueryBuilder('vehiculo')
      .where('vehiculo.nombreVehiculo = :name', { name })
      .getOne();
  }

  public async listAll(): Promise<Vehiculo[]> {
    return await this.vehiculoRepository
        .createQueryBuilder('vehiculo')
        .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.vehiculoRepository
      .createQueryBuilder('vehiculo')
      .paginate(10);
  }

  public async create(vehiculo: Vehiculo): Promise<Vehiculo> {
    return await this.vehiculoRepository.save(vehiculo);
  }

  public async update(updateVehiculo: Vehiculo): Promise<UpdateResult> {
    return await this.vehiculoRepository.update(updateVehiculo.id, updateVehiculo);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.vehiculoRepository.delete(id);
  }
}
