import { DeleteResult, Repository } from "typeorm";
import { Voluntario } from "../entities/Voluntario";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class VoluntarioService {
  constructor(
    @InjectRepository(Voluntario)
    private readonly voluntarioRepository: Repository<Voluntario>,
  ) { }

  public async findByCode(code: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .where('voluntario.id = :code', { code })
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
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
      .leftJoinAndSelect('voluntario.sede', 'sede')
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
      .getOne();
  }

  public async findByIdWithRelation(id: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .leftJoinAndSelect('voluntario.estado', 'estado')
      .leftJoinAndSelect('voluntario.modalidad', 'modalidad')
      .where('voluntario.id = :id', { id })
      .getOne();
  }

  public async findByIdWithNotesRelations(id: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .where('voluntario.id = :id', { id })
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .leftJoinAndSelect('voluntario.estado', 'estado')
      .leftJoinAndSelect('voluntario.modalidad', 'modalidad')
      .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .leftJoinAndSelect('voluntario.estado', 'estado')
      .leftJoinAndSelect('voluntario.modalidad', 'modalidad')
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
