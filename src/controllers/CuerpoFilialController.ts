import { CuerpoFilialService } from './../services/CuerpoFilialService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { CuerpoFilial } from '../entities/CuerpoFilial';
import { validate } from 'class-validator';

class CuerpoFilialController {
  static fetch = async (req: Request, res: Response) => {
    const cuerpoFilialService = Container.get(CuerpoFilialService);
    const cuerpoFilialList = await cuerpoFilialService.findAll();
    res.status(200).send(cuerpoFilialList);
  }

  static list = async (req: Request, res: Response) => {
    const cuerpoFilialService = Container.get(CuerpoFilialService);
    const cuerpoFilialList = await cuerpoFilialService.listAll();
    res.status(200).send(cuerpoFilialList);
  }

  static store = async (req: Request, res: Response) => {
    const cuerpoFilialService = Container.get(CuerpoFilialService);
    const { nombreCuerpoFilial, encargado }: { nombreCuerpoFilial: string, encargado : string } = req.body;

    const cuerpoFilial = new CuerpoFilial();
    cuerpoFilial.nombreCuerpoFilial = nombreCuerpoFilial;
    cuerpoFilial.encargado = encargado;

    const cuerpoFilialErrors = await validate(cuerpoFilial);
    if (cuerpoFilialErrors.length > 0) {
      res.status(400).send(cuerpoFilialErrors);
      return;
    }

    try {
      await cuerpoFilialService.create(cuerpoFilial);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el cuerpo filial' });
      return;
    }
    res.status(201).json({ message: 'Cuerpo filial creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const cuerpoFilialService = Container.get(CuerpoFilialService);
    const id: number = Number(req.params.id);
    const { nombreCuerpoFilial, encargado }: { nombreCuerpoFilial: string, encargado: string } = req.body;

    const cuerpoFilial = await cuerpoFilialService.findById(id);
    if (!cuerpoFilial) {
      res.status(404).json({ message: 'Cuerpo filial no encontrado ' });
      return;
    }

    cuerpoFilial.nombreCuerpoFilial = nombreCuerpoFilial;
    cuerpoFilial.encargado = encargado;

    const cuerpoFilialErrors = await validate(cuerpoFilial);
    if (cuerpoFilialErrors.length > 0) {
      res.status(400).send(cuerpoFilialErrors);
      return;
    }

    try {
      await cuerpoFilialService.update(cuerpoFilial);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el cuerpo filial' });
      return;
    }

    res.status(200).json({ message: 'Cuerpo filial actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const cuerpoFilialService = Container.get(CuerpoFilialService);
    const cuerpoFilial = await cuerpoFilialService.findById(id);
    if (!cuerpoFilial) {
      res.status(404).json({ message: 'Cuerpo filial no encontrado ' });
      return;
    }
    res.status(200).send(cuerpoFilial);
  }

  static destroy = async (req: Request, res: Response) => {
    const cuerpoFilialService = Container.get(CuerpoFilialService);
    const id: number = Number(req.params.id);
    const cuerpoFilial = await cuerpoFilialService.findById(id);
    if (!cuerpoFilial) {
      res.status(404).json({ message: 'Cuerpo filial no encontrado' });
      return;
    }
    await cuerpoFilialService.delete(id);
    res.status(204).send();
  }
}

export default CuerpoFilialController;
