import { TipoVoluntarioService } from './../services/TipoVoluntarioService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { TipoVoluntario } from '../entities/TipoVoluntario';
import { validate } from 'class-validator';

class TipoVoluntarioController {
  static fetch = async (req: Request, res: Response) => {
    const tipoVoluntarioService = Container.get(TipoVoluntarioService);
    const tipoVoluntarioList = await tipoVoluntarioService.findAll();
    res.status(200).send(tipoVoluntarioList);
  }

  static list = async (req: Request, res: Response) => {
    const tipoVoluntarioService = Container.get(TipoVoluntarioService);
    const tipoVoluntarioList = await tipoVoluntarioService.listAll();
    res.status(200).send(tipoVoluntarioList);
  }

  static store = async (req: Request, res: Response) => {
    const tipoVoluntarioService = Container.get(TipoVoluntarioService);
    const { nombreTipoVoluntario }: { nombreTipoVoluntario: string } = req.body;

    const tipoVoluntario = new TipoVoluntario();
    tipoVoluntario.nombreTipoVoluntario = nombreTipoVoluntario;

    const tipoVoluntarioErrors = await validate(tipoVoluntario);
    if (tipoVoluntarioErrors.length > 0) {
      res.status(400).send(tipoVoluntarioErrors);
      return;
    }

    try {
      await tipoVoluntarioService.create(tipoVoluntario);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el tipo nuevo de voluntario' });
      return;
    }
    res.status(201).json({ message: 'Tipo de voluntario creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const tipoVoluntarioService = Container.get(TipoVoluntarioService);
    const id: number = Number(req.params.id);
    const { nombreTipoVoluntario }: { nombreTipoVoluntario : string } = req.body;

    const tipoVoluntario = await tipoVoluntarioService.findById(id);
    if (!tipoVoluntario) {
      res.status(404).json({ message: 'Tipo de voluntario no encontrado ' });
      return;
    }

    tipoVoluntario.nombreTipoVoluntario = nombreTipoVoluntario;

    const tipoVoluntarioErrors = await validate(tipoVoluntario);
    if (tipoVoluntarioErrors.length > 0) {
      res.status(400).send(tipoVoluntarioErrors);
      return;
    }

    try {
      await tipoVoluntarioService.update(tipoVoluntario);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el tipo de voluntario' });
      return;
    }

    res.status(200).json({ message: 'Tipo de voluntario actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const tipoVoluntarioService = Container.get(TipoVoluntarioService);
    const tipoVoluntario = await tipoVoluntarioService.findById(id);
    if (!tipoVoluntario) {
      res.status(404).json({ message: 'Tipo de voluntario no encontrado ' });
      return;
    }
    res.status(200).send(tipoVoluntario);
  }

  static destroy = async (req: Request, res: Response) => {
    const tipoVoluntarioService = Container.get(TipoVoluntarioService);
    const id: number = Number(req.params.id);
    const tipoVoluntario = await tipoVoluntarioService.findById(id);
    if (!tipoVoluntario) {
      res.status(404).json({ message: 'Tipo de voluntario no encontrado' });
      return;
    }
    await tipoVoluntarioService.delete(id);
    res.status(204).send();
  }
}

export default TipoVoluntarioController;
