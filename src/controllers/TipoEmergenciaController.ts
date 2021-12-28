import { TipoEmergenciaService } from '../services/TipoEmergenciaService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { TipoEmergencia } from '../entities/TipoEmergencia';
import { validate } from 'class-validator';

class TipoEmergenciaController {
  static fetch = async (req: Request, res: Response) => {
    const tipoEmergenciaService = Container.get(TipoEmergenciaService);
    const tipoEmergenciaList = await tipoEmergenciaService.findAll();
    res.status(200).send(tipoEmergenciaList);
  }

  static list = async (req: Request, res: Response) => {
    const tipoEmergenciaService = Container.get(TipoEmergenciaService);
    const tipoEmergenciaList = await tipoEmergenciaService.listAll();
    res.status(200).send(tipoEmergenciaList);
  }

  static store = async (req: Request, res: Response) => {
    const tipoEmergenciaService = Container.get(TipoEmergenciaService);
    const { tipoEmergencia }: { tipoEmergencia: string } = req.body;

    const tipoEmer = new TipoEmergencia();
    tipoEmer.tipoEmergencia = tipoEmergencia;

    const tipoEmerErrors = await validate(tipoEmer);
    if (tipoEmerErrors.length > 0) {
      res.status(400).send(tipoEmerErrors);
      return;
    }

    try {
      await tipoEmergenciaService.create(tipoEmer);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el Tipo de Emergencia ' });
      return;
    }
    res.status(201).json({ message: 'Tipo de Emergencia creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const tipoEmergenciaService = Container.get(TipoEmergenciaService);
    const id: number = Number(req.params.id);
    const { tipoEmergencia }: { tipoEmergencia : string } = req.body;

    const tipoEmer = await tipoEmergenciaService.findById(id);
    if (!tipoEmer) {
      res.status(404).json({ message: 'Tipo de Emergencia no encontrado ' });
      return;
    }

    tipoEmer.tipoEmergencia = tipoEmergencia;

    const tipoEmerErrors = await validate(tipoEmer);
    if (tipoEmerErrors.length > 0) {
      res.status(400).send(tipoEmerErrors);
      return;
    }

    try {
      await tipoEmergenciaService.update(tipoEmer);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el Tipo de Emergencia' });
      return;
    }

    res.status(200).json({ message: 'Tipo de Emergencia actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const tipoEmergenciaService = Container.get(TipoEmergenciaService);
    const tipoEmer = await tipoEmergenciaService.findById(id);
    if (!tipoEmer) {
      res.status(404).json({ message: 'Tipo de Emergencia no encontrado ' });
      return;
    }
    res.status(200).send(tipoEmer);
  }

  static destroy = async (req: Request, res: Response) => {
    const tipoEmergenciaService = Container.get(TipoEmergenciaService);
    const id: number = Number(req.params.id);
    const tipoEmer = await tipoEmergenciaService.findById(id);
    if (!tipoEmer) {
      res.status(404).json({ message: 'Tipo de Emergencia no encontrado' });
      return;
    }
    await tipoEmergenciaService.delete(id);
    res.status(204).send();
  }
}

export default TipoEmergenciaController;
