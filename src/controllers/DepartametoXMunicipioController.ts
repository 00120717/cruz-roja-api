import { Request, Response } from 'express';
import { DepartamentoXMunicipioService } from '../services/DepartamentoXMunicipioService';
import { Container } from "typedi";

class DepartamentoXMunicipioController {
  static fetch = async (req: Request, res: Response) => {
    const roleService = Container.get(DepartamentoXMunicipioService);
    const roles = await roleService.findAll();
    res.status(200).send(roles);
  }

  static list = async (req: Request, res: Response) => {
    const roleService = Container.get(DepartamentoXMunicipioService);
    const roles = await roleService.listAll();
    let aux = roles.map(att =>{
      return {nombreCompuesto: (att.departamento.departamentoNombre+', '+att.municipio.municipioNombre), ...att };
    });
    res.status(200).send(aux);
  }

  static show = async (req: Request, res: Response) => {
    const roleService = Container.get(DepartamentoXMunicipioService);
    const id: number = Number(req.params.id);

    const role = await roleService.findByIdWithRelations(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado ' });
      return;
    }
    res.status(200).send(role);
  }

  static destroy = async (req: Request, res: Response) => {
    const roleService = Container.get(DepartamentoXMunicipioService);
    const id: number = Number(req.params.id);

    const role = await roleService.findById(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' })
    }

    await roleService.delete(id);
    res.status(204).send();
  }
}

export default DepartamentoXMunicipioController;
