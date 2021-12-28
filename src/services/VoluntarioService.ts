import { DeleteResult, Repository } from "typeorm";
import { Voluntario } from "../entities/Voluntario";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";
import { VoluntarioYear } from "../auxiliar-models/VoluntarioYear";
import { VoluntarioFecha } from "../auxiliar-models/VoluntarioFecha";

@Service()
export class VoluntarioService {
  constructor(
    @InjectRepository(Voluntario)
    private readonly voluntarioRepository: Repository<Voluntario>,
  ) { }

  public async findByUsername(code: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .where('persona.username = :code', { code })
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .getOne();
  }

  public async findByCode(code: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .where('voluntario.id = :code', { code })
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('sede.departamentoXmunicipio', 'departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .leftJoinAndSelect('voluntario.estado', 'estado')
      .leftJoinAndSelect('voluntario.modalidad', 'modalidad')
      .getOne();
  }

  public async findByCodeWithRelation(code: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .where('voluntario.id = :code', { code })
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.emergenciasAsignadas', 'emergenciasAsignadas')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('sede.departamentoXmunicipio', 'departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .leftJoinAndSelect('voluntario.estado', 'estado')
      .leftJoinAndSelect('voluntario.modalidad', 'modalidad')//faltan las tablas nxn
      .getOne();
  }

  public async findById(id: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .where('voluntario.id = :id', { id })
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('sede.departamentoXmunicipio', 'departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .getOne();
  }

  public async findByIdWithRelation(id: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('sede.departamentoXmunicipio', 'departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .leftJoinAndSelect('voluntario.estado', 'estado')
      .leftJoinAndSelect('voluntario.modalidad', 'modalidad')
      .where('voluntario.id = :id', { id })
      .getOne();
  }

  public async findByIdYearsOfService(id: string): Promise<VoluntarioYear> {
    return await this.voluntarioRepository
    .createQueryBuilder('voluntario')
    .select('TIMESTAMPDIFF(YEAR, voluntario.fecha_inicio, CURDATE())','aniosServicio')
    .where('voluntario.id = :id', { id })
    .printSql()
    .getRawOne();
  }

  public async findByIdYearsOldOfService(id: string): Promise<VoluntarioYear> {
    return await this.voluntarioRepository
    .createQueryBuilder('voluntario')
    .leftJoinAndSelect('voluntario.persona', 'persona')
    .select('TIMESTAMPDIFF(YEAR, persona.fechaNacimiento, CURDATE())','aniosServicio')
    .where('voluntario.id = :id', { id })
    .printSql()
    .getRawOne();
  }

  public async findByIdFechaInicio(id: string): Promise<VoluntarioFecha> {
    return await this.voluntarioRepository
    .createQueryBuilder('voluntario')
    .select('voluntario.fechaInicio','fecha')
    .where('voluntario.id = :id', { id })
    .printSql()
    .getRawOne();
  }

  public async findByIdWithNotesRelations(id: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      //.select('voluntario','voluntario')
      //.addSelect('SUM(voluntario.aniosServicio)','aniosServicio2')
      .where('voluntario.id = :id', { id })
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('sede.departamentoXmunicipio', 'departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .leftJoinAndSelect('voluntario.estado', 'estado')
      .leftJoinAndSelect('voluntario.modalidad', 'modalidad')
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      //.select('voluntario','voluntario')
      //.addSelect('SUM(voluntario.aniosServicio)','aniosServicio2')
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('sede.departamentoXmunicipio', 'departamentoXmunicipio')
      .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
      .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .leftJoinAndSelect('voluntario.estado', 'estado')
      .leftJoinAndSelect('voluntario.modalidad', 'modalidad')
      .orderBy('persona.estadoPersona','DESC')
      .addOrderBy('voluntario.id','ASC')
      .paginate(10);
  }

  public async create(voluntario: Voluntario): Promise<Voluntario> {
    return await this.voluntarioRepository.save(voluntario);
  }

  public async update(updateVoluntario: Voluntario): Promise<Voluntario> {
    return await this.voluntarioRepository.save(updateVoluntario);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.voluntarioRepository.delete(id);
  }
}
