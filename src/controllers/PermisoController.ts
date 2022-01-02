import { validate } from 'class-validator';
import { Permiso } from '../entities/Permiso';
import { PermisoService } from '../services/PermisoService';
import { Request, Response } from 'express';
import Container from "typedi"

class PermisoController {
  static fetch = async (req: Request, res: Response) => {
    const permisoService = Container.get(PermisoService);
    const permisos = await permisoService.findAll();
    res.status(200).send(permisos);
  }

  static list = async (req: Request, res: Response) => {
    const permisoService = Container.get(PermisoService);
    const permisos = await permisoService.listAll();
    res.status(200).send(permisos);
  }

  static store = async (req: Request, res: Response) => {
    const permisoService = Container.get(PermisoService);
    const { name }: { name: string } = req.body;

    const permiso = new Permiso();

    permiso.nombre = name;

    const permisoErrors = await validate(permiso);
    if (permisoErrors.length > 0) {
      res.status(400).send(permisoErrors);
      return;
    }

    try {
      await permisoService.create(permiso);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el permiso' });
      return;
    }

    res.status(201).json({ message: 'Permiso creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const permisoService = Container.get(PermisoService);
    const id = +req.params.id;

    const { name }: { name: string } = req.body;

    const permiso = await permisoService.findById(id);
    if (!permiso) {
      res.status(404).json({ message: 'Permiso no encontrado' })
      return;
    }

    permiso.nombre = name;

    const permisoErrors = await validate(permiso);
    if (permisoErrors.length > 0) {
      res.status(400).send(permisoErrors);
      return;
    }

    try {
      await permisoService.update(permiso);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el permiso' });
    }

    res.status(200).json({ message: 'Permiso actualizado correctamente' });
  }

  static show = async (req: Request, res: Response) => {
    const permisoService = Container.get(PermisoService);
    const id = +req.params.id;

    const permiso = await permisoService.findById(id);
    if (!permiso) {
      res.status(404).json({ message: 'Permiso no encontrado' });
    }

    res.status(200).send(permiso);
  }

  static destroy = async (req: Request, res: Response) => {
    const permisoService = Container.get(PermisoService);
    const id = +req.params.id;

    const permiso = await permisoService.findById(id);
    if (!permiso) {
      res.status(404).json({ message: 'Permiso no encontrado ' });
    }

    await permisoService.delete(id);
    res.status(204).send();
  }
}

export default PermisoController;
