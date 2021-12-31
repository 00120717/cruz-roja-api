import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { EmergenciaRealizada } from "../entities/EmergenciaRealizada";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class EmergenciaRealizadaService {
  constructor(
    @InjectRepository(EmergenciaRealizada)
    protected emergenciaRealizadaRepository: Repository<EmergenciaRealizada>,
  ) { }

  public async findById(id: string): Promise<EmergenciaRealizada | undefined> {
    return await this.emergenciaRealizadaRepository.findOne(id);
  }

  public async findByIds(ids: Array<number>): Promise<EmergenciaRealizada[]> {
    return await this.emergenciaRealizadaRepository.findByIds(ids);
  }

  public async findByName(name: string): Promise<EmergenciaRealizada | undefined> {
    return await this.emergenciaRealizadaRepository
      .createQueryBuilder('emergenciaRealizada')
      .where('emergenciaRealizada.emergenciaNombre = :name', { name })
      .getOne();
  }

  public async findByIdWithRelation(id: string): Promise<EmergenciaRealizada | undefined> {
    return await this.emergenciaRealizadaRepository
      .createQueryBuilder('emergenciaRealizada')
      .leftJoinAndSelect('emergenciaRealizada.voluntarios', 'voluntarios')
      .leftJoinAndSelect('emergenciaRealizada.emergenciaSeccional', 'emergenciaSeccional')
      .leftJoinAndSelect('emergenciaRealizada.emergenciaPaciente', 'emergenciaPaciente')
      .leftJoinAndSelect('emergenciaPaciente.paciente', 'paciente')
      .leftJoinAndSelect('paciente.persona', 'persona')
      .leftJoinAndSelect('emergenciaSeccional.seccional', 'seccional')
      .leftJoinAndSelect('seccional.departamentoXmunicipio', 'departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .where('emergenciaRealizada.id = :id', { id })
      .getOne();
  }
  public async findByIdUbicacion(id: number, fechaInicio: string, fechaFin: string): Promise<EmergenciaRealizada[]> {
    return await this.emergenciaRealizadaRepository
      .createQueryBuilder('emergenciaRealizada')
      .leftJoinAndSelect('emergenciaRealizada.voluntarios', 'voluntarios')
      .leftJoinAndSelect('emergenciaRealizada.emergenciaSeccional', 'emergenciaSeccional')
      .leftJoinAndSelect('emergenciaSeccional.seccional', 'seccional')
      .leftJoinAndSelect('seccional.departamentoXmunicipio', 'departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .where('departamentoXmunicipio.id = :id', { id })
      .andWhere('fechaRealizada >= :fechaInicio', { fechaInicio })
      .andWhere('fechaRealizada <= :fechaFin', { fechaFin })
      .getMany();
  }

  public async listAll(): Promise<EmergenciaRealizada[]> {
    return await this.emergenciaRealizadaRepository
      .createQueryBuilder('emergenciaRealizada')
      .getMany();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.emergenciaRealizadaRepository
      .createQueryBuilder('emergenciaRealizada')
      .paginate(10);
  }

  public async create(emergenciaRealizada: EmergenciaRealizada): Promise<EmergenciaRealizada> {
    return await this.emergenciaRealizadaRepository.save(emergenciaRealizada);
  }

  public async update(updateEmergenciaRealizada: EmergenciaRealizada): Promise<UpdateResult> {
    return await this.emergenciaRealizadaRepository.update(updateEmergenciaRealizada.id, updateEmergenciaRealizada);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.emergenciaRealizadaRepository.delete(id);
  }
}
