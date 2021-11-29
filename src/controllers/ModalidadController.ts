import { ModalidadService } from './../services/ModalidadService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Modalidad } from '../entities/Modalidad';
import { validate } from 'class-validator';

class ModalidadController {
  static fetch = async (req: Request, res: Response) => {
    const modalidadService = Container.get(ModalidadService);
    const modalidadList = await modalidadService.findAll();
    res.status(200).send(modalidadList);
  }

  static list = async (req: Request, res: Response) => {
    const modalidadService = Container.get(ModalidadService);
    const modalidadList = await modalidadService.listAll();
    res.status(200).send(modalidadList);
  }

  static store = async (req: Request, res: Response) => {
    const modalidadService = Container.get(ModalidadService);
    const { name }: { name: string} = req.body;

    const modalidad = new Modalidad();
    modalidad.modalidad = name;

    const modalidadErrors = await validate(modalidad);
    if (modalidadErrors.length > 0) {
      res.status(400).send(modalidadErrors);
      return;
    }

    try {
      await modalidadService.create(modalidad);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la modalidad' });
      return;
    }
    res.status(201).json({ message: 'Modalidad creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const modalidadService = Container.get(ModalidadService);
    const id: number = Number(req.params.id);
    const { name }: { name: string } = req.body;

    const modalidad = await modalidadService.findById(id);
    if (!modalidad) {
      res.status(404).json({ message: 'Modalidad no encontrada ' });
      return;
    }

    modalidad.modalidad = name;

    const modalidadErrors = await validate(modalidad);
    if (modalidadErrors.length > 0) {
      res.status(400).send(modalidadErrors);
      return;
    }

    try {
      await modalidadService.update(modalidad);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la modalidad' });
      return;
    }

    res.status(200).json({ message: 'Modalidad actualizada' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const modalidadService = Container.get(ModalidadService);
    const modalidad = await modalidadService.findById(id);
    if (!modalidad) {
      res.status(404).json({ message: 'Modalidad no encontrada ' });
      return;
    }
    res.status(200).send(modalidad);
  }

  static destroy = async (req: Request, res: Response) => {
    const modalidadService = Container.get(ModalidadService);
    const id: number = Number(req.params.id);
    const modalidad = await modalidadService.findById(id);
    if (!modalidad) {
      res.status(404).json({ message: 'Modalidad no encontrada' });
      return;
    }
    await modalidadService.delete(id);
    res.status(204).send();
  }
}

export default ModalidadController;