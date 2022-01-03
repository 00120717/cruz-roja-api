import { Request, Response } from 'express';
import { DepartamentoXMunicipioService } from '../services/DepartamentoXMunicipioService';
import { Container } from "typedi";

class DepartamentoXMunicipioController {
  static fetch = async (req: Request, res: Response) => {
    const departamentoXMunicipioService = Container.get(DepartamentoXMunicipioService);
    const departamentoXmunicipio = await departamentoXMunicipioService.findAll();
    res.status(200).send(departamentoXmunicipio);
  }

  static list = async (req: Request, res: Response) => {
    const departamentoXMunicipioService = Container.get(DepartamentoXMunicipioService);
    const departamentoXmunicipio = await departamentoXMunicipioService.listAll();
    let aux = departamentoXmunicipio.map(att =>{
      return {nombreCompuesto: (att.departamento.departamentoNombre+', '+att.municipio.municipioNombre), ...att };
    });
    res.status(200).send(aux);
  }

  static show = async (req: Request, res: Response) => {
    const departamentoXMunicipioService = Container.get(DepartamentoXMunicipioService);
    const id: number = Number(req.params.id);

    const role = await departamentoXMunicipioService.findByIdWithRelations(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado ' });
      return;
    }
    res.status(200).send(role);
  }

  static destroy = async (req: Request, res: Response) => {
    const departamentoXMunicipioService = Container.get(DepartamentoXMunicipioService);
    const id: number = Number(req.params.id);

    const role = await departamentoXMunicipioService.findById(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' })
    }

    await departamentoXMunicipioService.delete(id);
    res.status(204).send();
  }
}

export default DepartamentoXMunicipioController;
