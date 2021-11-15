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
    const { name, direccion, code, tipoSedeId, active }: { name: string, direccion: string, code: string, tipoSedeId: number, active: boolean } = req.body;

    const sede = new Sede();
    sede.nombre = name;
    sede.direccion = direccion;
    sede.codigo = code;

    const sedeErrors = await validate(sede);
    if (sedeErrors.length > 0) {
      res.status(400).send(sedeErrors);
      return;
    }

    const tipoSede = await tipoSedeService.findById(tipoSedeId);
    if (!tipoSede) {
      res.status(400).json({ message: 'La sede que intenta asignar no existe' });
      return;
    }

    if (active) {
      const currentActive = await sedeService.findActive();
      if (currentActive) {

        await sedeService.update(currentActive);
      }
    }

    try {
      await sedeService.create(sede);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la sede'});
      return;
    }
    res.status(201).json({ message: 'Sede creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const id: number = Number(req.params.id);
    const { name, code, address, active }: { name: string, logo: string, code: string, address: string, active: boolean } = req.body;

    const sede = await sedeService.findById(id);
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada '});
      return;
    }

    sede.nombre = name;
    sede.codigo = code;
    sede.direccion = address;

    const sedeErrors = await validate(sede);
    if (sedeErrors.length > 0) {
      res.status(400).send(sedeErrors);
      return;
    }

    if (active) {
      const currentActive = await sedeService.findActive();
      if (currentActive) {

        await sedeService.update(currentActive);
      }
    }

    try {
      await sedeService.update(sede);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la sede'});
      return;
    }

    res.status(200).json({ message: 'Sede actualizada' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const sedeService = Container.get(SedeService);
    const sede = await sedeService.findById(id);
    if (!sede) {
      res.status(404).json({ message: 'Sede no encontrada '});
      return;
    }
    res.status(200).send(sede);
  }

  static sedeInformation = async (req: Request, res: Response) => {
    const sedeService = Container.get(SedeService);
    const sede = await sedeService.findActive();
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
      res.status(404).json({ message: 'Sede no encontrada'});
      return;
    }
    await sedeService.delete(id);
    res.status(204).send();
  }
}

export default SedeController;
