import { DeleteResult, Repository } from "typeorm";
import { EmergenciasAsignadas } from "../entities/EmergenciasAsignadas";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class EmergenciasAsignadasService {
  constructor(
    @InjectRepository(EmergenciasAsignadas)
    protected emergenciaAsignadaRepository: Repository<EmergenciasAsignadas>,
  ) {}

  public async findById(id: string): Promise<EmergenciasAsignadas | undefined> {
    return await this.emergenciaAsignadaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .leftJoinAndSelect('emergenciasAsignadas.emergencia', 'emergencia')
      .where('voluntario.id = :id', { id }).getOne();
  }

  public async findByIdWithRelation(id: string): Promise<EmergenciasAsignadas | undefined> {
    return await this.emergenciaAsignadaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .leftJoinAndSelect('emergenciasAsignadas.emergencia', 'emergencia')
      .where('emergenciasAsignadas.id = :id', { id })
      .getOne();
  }

  public async findByIdMany(id: string): Promise<EmergenciasAsignadas[] | undefined> {
    return await this.emergenciaAsignadaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .leftJoinAndSelect('emergenciasAsignadas.emergencia', 'emergencia')
      .where('voluntario.id = :id', { id }).getMany();
  }

  public async findByIds(ids: Array<string>): Promise<EmergenciasAsignadas[]> {
    return await this.emergenciaAsignadaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .leftJoinAndSelect('emergenciasAsignadas.emergencia', 'emergencia')
      .where('voluntario.id IN (:ids)', { ids }).getMany();
  }

  public async listAll(): Promise<EmergenciasAsignadas[]> {
    return await this.emergenciaAsignadaRepository
        .createQueryBuilder('emergenciasAsignadas')
        .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.emergenciaAsignadaRepository
      .createQueryBuilder('emergenciasAsignadas')
      .leftJoinAndSelect('emergenciasAsignadas.voluntario', 'voluntario')
      .leftJoinAndSelect('emergenciasAsignadas.emergencia', 'emergencia')
      .paginate(10);
  }

  public async create(emergenciasAsignadas: EmergenciasAsignadas): Promise<EmergenciasAsignadas> {
    return await this.emergenciaAsignadaRepository.save(emergenciasAsignadas);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.emergenciaAsignadaRepository.delete(id);
  }
}
