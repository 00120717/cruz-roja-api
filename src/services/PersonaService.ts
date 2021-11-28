import {DeleteResult, Repository, UpdateResult} from "typeorm";
import { Persona } from "../entities/Persona";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";

@Service()
export class PersonaService {
    constructor(
        @InjectRepository(Persona)
        private readonly personaRepository: Repository<Persona>,
    ) { }

    public async findById(id: string): Promise<Persona | undefined> {
        return await this.personaRepository
            .createQueryBuilder('persona')
            .where('persona.id = :id', { id })
            .getOne();
    }

    public async findByIdWithRelation(id: string): Promise<Persona | undefined> {
        return await this.personaRepository
            .createQueryBuilder('persona')
            .where('persona.id = :id', { id })
            .getOne();
    }

    public async findAll(): Promise<PaginationAwareObject> {
        return await this.personaRepository
            .createQueryBuilder('persona')
            .paginate(10);
    }

    public async create(persona: Persona): Promise<Persona> {
        return await this.personaRepository.save(persona);
    }

    public async update(updatePersona: Persona): Promise<UpdateResult> {
        return await this.personaRepository.update(updatePersona.id, updatePersona);
    }

    public async delete(id: string): Promise<DeleteResult> {
        return await this.personaRepository.delete(id);
    }
}
