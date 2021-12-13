import { SedeService } from './../services/SedeService';
import { TipoSedeService } from './../services/TipoSedeService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Sede } from '../entities/Sede';
import { validate } from 'class-validator';

class SedeController {
  static fetch = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const sedeList = await sedeService.findAll();
    res.status(200).send(sedeList);
  }

  static list = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const sedeList = await sedeService.listAll();
    res.status(200).send(sedeList);
  }

  static store = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const tipoSedeService = Container.get(TipoSedeService);
    const { nombre, direccion, codigo, tipoSedeId }: { nombre: string, direccion: string, codigo: string, tipoSedeId: number } = req.body;

    const sede = new Sede();
    sede.nombre = nombre;
    sede.direccion = direccion;
    sede.codigo = codigo;

    const sedeErrors = await validate(sede);
    if (sedeErrors.length > 0) {
      res.status(400).send(sedeErrors);
      return;
    }

    const tipoSede = await tipoSedeService.findById(tipoSedeId);
    if (!tipoSede) {
      res.status(400).json({ message: 'La tipo sede que intenta asignar no existe' });
      return;
    }

    sede.tipoSede = tipoSede;

    try {
      await sedeService.create(sede);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la sede' });
      return;
    }
    res.status(201).json({ message: 'Sede creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const tipoSedeService = Container.get(TipoSedeService);
    const id: number = Number(req.params.id);
    const { nombre, codigo, direccion, tipoSedeId }: { nombre: string, codigo: string, direccion: string, tipoSedeId: number } = req.body;

    const sede = await sedeService.findById(id);
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada ' });
      return;
    }

    sede.nombre = nombre;
    sede.codigo = codigo;
    sede.direccion = direccion;

    const sedeErrors = await validate(sede);
    if (sedeErrors.length > 0) {
      res.status(400).send(sedeErrors);
      return;
    }

    const tipoSede = await tipoSedeService.findById(tipoSedeId);
    if (!tipoSede) {
      res.status(400).json({ message: 'La tipo sede que intenta asignar no existe' });
      return;
    }

    sede.tipoSede = tipoSede;

    try {
      await sedeService.update(sede);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la sede' });
      return;
    }

    res.status(200).json({ message: 'Sede actualizada' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const sedeService = Container.get(SedeService);
    const sede = await sedeService.findById(id);
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada ' });
      return;
    }
    res.status(200).send(sede);
  }

  static sedeInformation = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const sede = await sedeService.findOne();
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada' });
      return;
    }
    res.status(200).send(sede);
  }

  static destroy = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const id: number = Number(req.params.id);
    const sede = await sedeService.findById(id);
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada' });
      return;
    }
    await sedeService.delete(id);
    res.status(204).send();
  }
}

export default SedeController;
