import { TipoSedeService } from '../services/TipoSedeService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { TipoSede } from '../entities/TipoSede';
import { validate } from 'class-validator';

class TipoSedeController {
  static fetch = async (req: Request, res: Response) => {
    const tipoSedeService = Container.get(TipoSedeService);
    const tipoSedeList = await tipoSedeService.findAll();
    res.status(200).send(tipoSedeList);
  }

  static list = async (req: Request, res: Response) => {
    const tipoSedeService = Container.get(TipoSedeService);
    const tipoSedeList = await tipoSedeService.listAll();
    res.status(200).send(tipoSedeList);
  }

  static store = async (req: Request, res: Response) => {
    const tipoSedeService = Container.get(TipoSedeService);
    const { nombreTipoSede }: { nombreTipoSede: string } = req.body;

    const tipoVoluntario = new TipoSede();
    tipoVoluntario.nombreTipoSede = nombreTipoSede;

    const tipoVoluntarioErrors = await validate(tipoVoluntario);
    if (tipoVoluntarioErrors.length > 0) {
      res.status(400).send(tipoVoluntarioErrors);
      return;
    }

    try {
      await tipoSedeService.create(tipoVoluntario);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el tipo sede ' });
      return;
    }
    res.status(201).json({ message: 'tipo sede creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const tipoSedeService = Container.get(TipoSedeService);
    const id: number = Number(req.params.id);
    const { nombreTipoSede }: { nombreTipoSede : string } = req.body;

    const tipoVoluntario = await tipoSedeService.findById(id);
    if (!tipoVoluntario) {
      res.status(404).json({ message: 'tipo sede no encontrado ' });
      return;
    }

    tipoVoluntario.nombreTipoSede = nombreTipoSede;

    const tipoVoluntarioErrors = await validate(tipoVoluntario);
    if (tipoVoluntarioErrors.length > 0) {
      res.status(400).send(tipoVoluntarioErrors);
      return;
    }

    try {
      await tipoSedeService.update(tipoVoluntario);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el tipo sede' });
      return;
    }

    res.status(200).json({ message: 'tipo sede actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const tipoSedeService = Container.get(TipoSedeService);
    const tipoVoluntario = await tipoSedeService.findById(id);
    if (!tipoVoluntario) {
      res.status(404).json({ message: 'tipo sede no encontrado ' });
      return;
    }
    res.status(200).send(tipoVoluntario);
  }

  static destroy = async (req: Request, res: Response) => {
    const tipoSedeService = Container.get(TipoSedeService);
    const id: number = Number(req.params.id);
    const tipoVoluntario = await tipoSedeService.findById(id);
    if (!tipoVoluntario) {
      res.status(404).json({ message: 'tipo sede no encontrado' });
      return;
    }
    await tipoSedeService.delete(id);
    res.status(204).send();
  }
}

export default TipoSedeController;
