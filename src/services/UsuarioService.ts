import { Repository, DeleteResult } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

@Service()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    protected usuarioRepository: Repository<Usuario>,
  ) {}

  public async findByUsernameWithRole(username: string): Promise<Usuario | undefined> {
    return await this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.contrasenia')
      .innerJoinAndSelect('usuario.rol', 'rol')
      .innerJoinAndSelect('usuario.persona', 'persona')
      .where('persona.username = :username', { username })
      .getOne();
  }

  public async findById(id: number): Promise<Usuario | undefined> {
    return await this.usuarioRepository.createQueryBuilder('usuario')
        .where('usuario.id = :id', { id })
        .getOne()
  }

  public async findByIdWithRelations(id: number): Promise<Usuario | undefined> {
    return await this.usuarioRepository.createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.rol', 'rol')
        .leftJoinAndSelect('usuario.persona', 'persona')
        .leftJoinAndSelect('usuario.sede', 'sede')
        .leftJoinAndSelect('sede.departamentoXmunicipio', 'departamentoXmunicipio')
        .leftJoinAndSelect('departamentoXmunicipio.municipio', 'municipio')
        .leftJoinAndSelect('departamentoXmunicipio.departamento', 'departamento')
        .where('usuario.id = :id', { id })
        .getOne()
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.usuarioRepository
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .paginate(10);
  }

  public async create(user: Usuario): Promise<Usuario> {
    return await this.usuarioRepository.save(user);
  }

  public async update(updateUsuario: Usuario): Promise<Usuario | undefined> {
    const usuario = await this.usuarioRepository.findOneOrFail(updateUsuario.id);
    if (!usuario.id) {
      return new Promise((resolve, reject) => {
          setTimeout(function () {
            reject({
                statusCode: 404,
                error: 'User not found',
            });
          }, 250);
      });
    }
    await this.usuarioRepository.update(updateUsuario.id, updateUsuario);
    return await this.usuarioRepository.findOne(updateUsuario.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.usuarioRepository.delete(id);
  }
}
