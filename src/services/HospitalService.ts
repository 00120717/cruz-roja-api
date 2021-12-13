import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Hospital } from "../entities/Hospital";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class HospitalService {
  constructor(
    @InjectRepository(Hospital)
    protected hospitalRepository: Repository<Hospital>,
  ) {}

  public async findById(id: number): Promise<Hospital | undefined> {
    return await this.hospitalRepository.findOne(id);
  }

  public async findByIds(ids: Array<number>): Promise<Hospital[]> {
    return await this.hospitalRepository.findByIds(ids);
  }

  public async findByName(name: string): Promise<Hospital | undefined> {
    return await this.hospitalRepository
      .createQueryBuilder('hospital')
      .where('hospital.nombreHospital = :name', { name })
      .getOne();
  }

  public async listAll(): Promise<Hospital[]> {
    return await this.hospitalRepository
        .createQueryBuilder('hospital')
        .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.hospitalRepository
      .createQueryBuilder('hospital')
      .paginate(10);
  }

  public async create(hospital: Hospital): Promise<Hospital> {
    return await this.hospitalRepository.save(hospital);
  }

  public async update(updateHospital: Hospital): Promise<UpdateResult> {
    return await this.hospitalRepository.update(updateHospital.id, updateHospital);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.hospitalRepository.delete(id);
  }
}
