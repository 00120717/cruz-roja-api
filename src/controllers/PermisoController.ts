import { validate } from 'class-validator';
import { Permiso } from '../entities/Permiso';
import { PermisoService } from '../services/PermisoService';
import { Request, Response } from 'express';
import Container from "typedi"

class PermisoController {
  static fetch = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermisoService);
    const permissions = await permissionService.findAll();
    res.status(200).send(permissions);
  }

  static list = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermisoService);
    const permissions = await permissionService.listAll();
    res.status(200).send(permissions);
  }

  static store = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermisoService);
    const { name }: { name: string } = req.body;

    const permission = new Permiso();

    permission.nombre = name;

    const permissionErrors = await validate(permission);
    if (permissionErrors.length > 0) {
      res.status(400).send(permissionErrors);
      return;
    }

    try {
      await permissionService.create(permission);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el permiso' });
      return;
    }

    res.status(201).json({ message: 'Permiso creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermisoService);
    const id = +req.params.id;

    const { name }: { name: string } = req.body;

    const permission = await permissionService.findById(id);
    if (!permission) {
      res.status(404).json({ message: 'Permiso no encontrado' })
      return;
    }

    permission.nombre = name;

    const permissionErrors = await validate(permission);
    if (permissionErrors.length > 0) {
      res.status(400).send(permissionErrors);
      return;
    }

    try {
      await permissionService.update(permission);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el permiso' });
    }

    res.status(200).json({ message: 'Permiso actualizado correctamente' });
  }

  static show = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermisoService);
    const id = +req.params.id;

    const permission = await permissionService.findById(id);
    if (!permission) {
      res.status(404).json({ message: 'Permiso no encontrado' });
    }

    res.status(200).send(permission);
  }

  static destroy = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermisoService);
    const id = +req.params.id;

    const permission = await permissionService.findById(id);
    if (!permission) {
      res.status(404).json({ message: 'Permiso no encontrado ' });
    }

    await permissionService.delete(id);
    res.status(204).send();
  }
}

export default PermisoController;
