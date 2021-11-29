import { EstadoService } from './../services/EstadoService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Estado } from '../entities/Estado';
import { validate } from 'class-validator';

class EstadoController {
  static fetch = async (req: Request, res: Response) => {
    const estadoService = Container.get(EstadoService);
    const estadoList = await estadoService.findAll();
    res.status(200).send(estadoList);
  }

  static list = async (req: Request, res: Response) => {
    const estadoService = Container.get(EstadoService);
    const estadoList = await estadoService.listAll();
    res.status(200).send(estadoList);
  }

  static store = async (req: Request, res: Response) => {
    const estadoService = Container.get(EstadoService);
    const { estadoVoluntario }: { estadoVoluntario: string } = req.body;

    const estado = new Estado();
    estado.estadoVoluntario = estadoVoluntario;

    const estadoErrors = await validate(estado);
    if (estadoErrors.length > 0) {
      res.status(400).send(estadoErrors);
      return;
    }

    try {
      await estadoService.create(estado);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el estado' });
      return;
    }
    res.status(201).json({ message: 'Estado creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const estadoService = Container.get(EstadoService);
    const id: number = Number(req.params.id);
    const { estadoVoluntario }: { estadoVoluntario: string } = req.body;

    const estado = await estadoService.findById(id);
    if (!estado) {
      res.status(404).json({ message: 'Estado no encontrado ' });
      return;
    }

    estado.estadoVoluntario = estadoVoluntario;

    const estadoErrors = await validate(estado);
    if (estadoErrors.length > 0) {
      res.status(400).send(estadoErrors);
      return;
    }

    try {
      await estadoService.update(estado);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el estado' });
      return;
    }

    res.status(200).json({ message: 'Estado actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const estadoService = Container.get(EstadoService);
    const estado = await estadoService.findById(id);
    if (!estado) {
      res.status(404).json({ message: 'Estado no encontrado ' });
      return;
    }
    res.status(200).send(estado);
  }

  static destroy = async (req: Request, res: Response) => {
    const estadoService = Container.get(EstadoService);
    const id: number = Number(req.params.id);
    const estado = await estadoService.findById(id);
    if (!estado) {
      res.status(404).json({ message: 'Sede no encontrada' });
      return;
    }
    await estadoService.delete(id);
    res.status(204).send();
  }
}

export default EstadoController;
