import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { VehiculoXEmergenciaPaciente } from "../entities/VehiculoXEmergenciaPaciente";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

@Service()
export class VehiculoXEmergenciaPacienteService {
  constructor(
    @InjectRepository(VehiculoXEmergenciaPaciente)
    protected emergenciaRealizadaRepository: Repository<VehiculoXEmergenciaPaciente>,
  ) { }

  public async findById(id: string): Promise<VehiculoXEmergenciaPaciente | undefined> {
    return await this.emergenciaRealizadaRepository.findOne(id);
  }

  public async create(emergenciaRealizada: VehiculoXEmergenciaPaciente): Promise<VehiculoXEmergenciaPaciente> {
    return await this.emergenciaRealizadaRepository.save(emergenciaRealizada);
  }

  public async update(updateEmergenciaRealizada: VehiculoXEmergenciaPaciente): Promise<UpdateResult> {
    return await this.emergenciaRealizadaRepository.update(updateEmergenciaRealizada.id, updateEmergenciaRealizada);
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.emergenciaRealizadaRepository.delete(id);
  }
}
