import { Repository } from "typeorm";
import { EmergenciasAsignadas } from "../entities/EmergenciasAsignadas";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class EmergenciasAsignadasService {
  constructor(
    @InjectRepository(EmergenciasAsignadas)
    protected emergenciaRepository: Repository<EmergenciasAsignadas>,
  ) {}

  public async findById(id: number): Promise<EmergenciasAsignadas | undefined> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .where('voluntario.id = :id', { id }).getOne();
  }

  public async findByIdMany(id: number): Promise<EmergenciasAsignadas[] | undefined> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .where('voluntario.id = :id', { id }).getMany();
  }

  public async findByIds(ids: Array<number>): Promise<EmergenciasAsignadas[]> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .where('voluntario.id IN (:ids)', { ids }).getMany();
  }

  public async findByName(id: number): Promise<EmergenciasAsignadas | undefined> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .where('voluntario.id = :id', { id })
      .getOne();
  }

  public async listAll(): Promise<EmergenciasAsignadas[]> {
    return await this.emergenciaRepository
        .createQueryBuilder('emergenciasAsignadas')
        .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.emergenciaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .paginate(10);
  }

  public async create(emergenciasAsignadas: EmergenciasAsignadas): Promise<EmergenciasAsignadas> {
    return await this.emergenciaRepository.save(emergenciasAsignadas);
  }
}
