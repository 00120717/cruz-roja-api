import { Repository, DeleteResult } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { PaginationAwareObject } from "typeorm-pagination/dist/helpers/pagination";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

@Service()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    protected userRepository: Repository<Usuario>,
  ) {}

  public async findByUsernameWithRole(username: string): Promise<Usuario | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.contrasenia')
      .innerJoinAndSelect('user.rol', 'rol')
      .innerJoinAndSelect('user.persona', 'persona')
      .where('persona.username = :username', { username })
      .getOne();
  }

  public async findById(id: number): Promise<Usuario | undefined> {
    return await this.userRepository.createQueryBuilder('user')
        .where('user.id = :id', { id })
        .getOne()
  }

  public async findByIdWithRelations(id: number): Promise<Usuario | undefined> {
    return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('user.person', 'person')
        .leftJoinAndSelect('user.subject', 'subject')
        .leftJoinAndSelect('person.sede', 'sede')
        .where('user.id = :id', { id })
        .getOne()
  }

  public async findAll(): Promise<PaginationAwareObject> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.rol', 'rol')
      .leftJoinAndSelect('user.persona', 'persona')
      .paginate(10);
  }

  public async create(user: Usuario): Promise<Usuario> {
    return await this.userRepository.save(user);
  }

  public async update(newUser: Usuario): Promise<Usuario | undefined> {
    const user = await this.userRepository.findOneOrFail(newUser.id);
    if (!user.id) {
      return new Promise((resolve, reject) => {
          setTimeout(function () {
            reject({
                statusCode: 404,
                error: 'User not found',
            });
          }, 250);
      });
    }
    await this.userRepository.update(newUser.id, newUser);
    return await this.userRepository.findOne(newUser.id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
