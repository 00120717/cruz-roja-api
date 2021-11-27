import {DeleteResult, Repository} from "typeorm";
import {Voluntario} from "../entities/Voluntario";
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
      .where('voluntario.code = :code', { code })
      .leftJoinAndSelect('voluntario.persona', 'persona')
      .leftJoinAndSelect('voluntario.sede', 'sede')
      .leftJoinAndSelect('voluntario.tipoVoluntario', 'tipoVoluntario')
      .leftJoinAndSelect('voluntario.cuerpoFilial', 'cuerpoFilial')
      .getOne();
  }

  public async findByCodeWithRelation(code: string): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      // .leftJoin('voluntario.subjectQualifications', 'subjectQualifications')
      // .leftJoin('subjectQualifications.qualifications', 'qualifications')
      // .leftJoinAndMapOne('voluntario.modules', 'qualifications.module', 'modules')
      .where('voluntario.code = :code', { code })
      .leftJoinAndSelect('voluntario.person', 'person')
      .leftJoinAndSelect('person.sede', 'sede')
      .leftJoinAndSelect('voluntario.modality', 'modality')
      .leftJoinAndSelect('voluntario.section', 'section')
      .leftJoinAndSelect('voluntario.grade', 'grade')
      .leftJoinAndSelect('voluntario.subjectQualifications', 'subjectQualifications')
      .leftJoinAndSelect('subjectQualifications.subject', 'subject')
      .leftJoinAndSelect('subjectQualifications.qualifications', 'qualifications')
      .leftJoinAndSelect('qualifications.module', 'module')
      .getOne();
  }

  public async findById(id: number): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .where('voluntario.id = :id', { id })
      .leftJoinAndSelect('voluntario.person', 'person')
      .leftJoinAndSelect('person.sede', 'sede')
      .getOne();
  }

  public async findByIdWithRelation(id: number): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .leftJoinAndSelect('voluntario.person', 'person')
      .leftJoinAndSelect('person.sede', 'sede')
      .leftJoinAndSelect('voluntario.modality', 'modality')
      .leftJoinAndSelect('voluntario.section', 'section')
      .leftJoinAndSelect('voluntario.grade', 'grade')
      .where('voluntario.id = :id', { id })
      .getOne();
  }

  public async findByIdWithNotesRelations(id: number): Promise<Voluntario | undefined> {
    return await this.voluntarioRepository
        .createQueryBuilder('voluntario')
        .where('voluntario.id = :id', { id })
        .leftJoinAndSelect('voluntario.person', 'person')
        .leftJoinAndSelect('person.sede', 'sede')
        .leftJoinAndSelect('voluntario.modality', 'modality')
        .leftJoinAndSelect('voluntario.section', 'section')
        .leftJoinAndSelect('voluntario.grade', 'grade')
        .leftJoinAndSelect('voluntario.subjectQualifications', 'subjectQualifications')
        .leftJoinAndSelect('subjectQualifications.subject', 'subject')
        .leftJoinAndSelect('subjectQualifications.qualifications', 'qualifications')
        .leftJoinAndSelect('qualifications.module', 'module')
        .getOne();
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.voluntarioRepository
      .createQueryBuilder('voluntario')
      .leftJoinAndSelect('voluntario.person', 'person')
      .leftJoinAndSelect('voluntario.modality', 'modality')
      .leftJoinAndSelect('voluntario.section', 'section')
      .leftJoinAndSelect('voluntario.grade', 'grade')
      .paginate(10);
  }

  public async create(voluntario: Voluntario): Promise<Voluntario> {
    return await this.voluntarioRepository.save(voluntario);
  }

  public async update(newvoluntario: Voluntario): Promise<Voluntario> {
    return await this.voluntarioRepository.save(newvoluntario);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.voluntarioRepository.delete(id);
  }
}
