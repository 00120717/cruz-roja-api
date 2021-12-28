import { SeccionalService } from '../services/SeccionalService';
import { DepartamentoXMunicipioService } from '../services/DepartamentoXMunicipioService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Seccional } from '../entities/Seccional';
import { validate } from 'class-validator';

class SeccionalController {
  static fetch = async (req: Request, res: Response) => {
    const seccionalService = Container.get(SeccionalService);
    const seccionalList = await seccionalService.findAll();
    res.status(200).send(seccionalList);
  }

  static list = async (req: Request, res: Response) => {
    const seccionalService = Container.get(SeccionalService);
    const seccionalList = await seccionalService.listAll();
    res.status(200).send(seccionalList);
  }

  static store = async (req: Request, res: Response) => {
    const seccionalService = Container.get(SeccionalService);
    const departamentoXmunicipioService = Container.get(DepartamentoXMunicipioService);
    const { nombre, codigo, departamentoXmunicipioId }: { nombre: string, codigo: string, departamentoXmunicipioId: number } = req.body;

    const seccional = new Seccional();
    seccional.nombre = nombre;
    seccional.codigo = codigo;

    const departamentoXmunicipio = await departamentoXmunicipioService.findById(departamentoXmunicipioId);
    if (!departamentoXmunicipio) {
      res.status(400).json({ message: 'El departamento y municipio que desea asignar no existe' });
      return;
    }

    seccional.departamentoXmunicipio = departamentoXmunicipio;

    const seccionalErrors = await validate(seccional);
    if (seccionalErrors.length > 0) {
      res.status(400).send(seccionalErrors);
      return;
    }

    try {
      await seccionalService.create(seccional);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la Seccional' });
      return;
    }
    res.status(201).json({ message: 'Seccional creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const seccionalService = Container.get(SeccionalService);
    const departamentoXmunicipioService = Container.get(DepartamentoXMunicipioService);
    const id: number = Number(req.params.id);
    const { nombre, codigo, departamentoXmunicipioId }: { nombre: string, codigo: string, departamentoXmunicipioId: number } = req.body;

    const seccional = await seccionalService.findById(id);
    if (!seccional) {
      res.status(404).json({ message: 'Sede no encontrada ' });
      return;
    }

    seccional.nombre = nombre;
    seccional.codigo = codigo;

    const departamentoXmunicipio = await departamentoXmunicipioService.findById(departamentoXmunicipioId);
    if (!departamentoXmunicipio) {
      res.status(400).json({ message: 'El departamento y municipio que desea asignar no existe' });
      return;
    }

    seccional.departamentoXmunicipio = departamentoXmunicipio;

    const seccionalErrors = await validate(seccional);
    if (seccionalErrors.length > 0) {
      res.status(400).send(seccionalErrors);
      return;
    }

    try {
      await seccionalService.update(seccional);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la Seccional' });
      return;
    }

    res.status(200).json({ message: 'Seccional actualizada' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const seccionalService = Container.get(SeccionalService);
    const seccional = await seccionalService.findById(id);
    if (!seccional) {
      res.status(404).json({ message: 'Seccional no encontrada ' });
      return;
    }
    res.status(200).send(seccional);
  }

  static destroy = async (req: Request, res: Response) => {
    const seccionalService = Container.get(SeccionalService);
    const id: number = Number(req.params.id);
    const seccional = await seccionalService.findById(id);
    if (!seccional) {
      res.status(404).json({ message: 'Seccional no encontrada' });
      return;
    }
    await seccionalService.delete(id);
    res.status(204).send();
  }
}

export default SeccionalController;
