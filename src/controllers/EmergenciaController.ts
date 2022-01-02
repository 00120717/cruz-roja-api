import { EmergenciaService } from '../services/EmergenciaService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Emergencia } from '../entities/Emergencia';
import { validate } from 'class-validator';
import { TipoEmergenciaService } from '../services/TipoEmergenciaService';

class EmergenciaController {
  static fetch = async (req: Request, res: Response) => {
    const emergenciaService = Container.get(EmergenciaService);
    const emergenciaList = await emergenciaService.findAll();
    res.status(200).send(emergenciaList);
  }

  static list = async (req: Request, res: Response) => {
    const emergenciaService = Container.get(EmergenciaService);
    const emergenciaList = await emergenciaService.listAll();
    res.status(200).send(emergenciaList);
  }

  static store = async (req: Request, res: Response) => {
    const emergenciaService = Container.get(EmergenciaService);
    const tipoEmergenciaService = Container.get(TipoEmergenciaService);
    const {
      emergenciaCodigo,
      emergenciaNombre,
      emergenciaInicio,
      emergenciaFinal,
      emergenciaDescripcion,
      tipoEmergenciaId,
  }: {
      emergenciaCodigo: string,
      emergenciaNombre: string,
      emergenciaInicio: string,
      emergenciaFinal: string,
      emergenciaDescripcion: string,
      tipoEmergenciaId: number,
  } = req.body;


    const emergencia = new Emergencia();
    emergencia.emergenciaCodigo = emergenciaCodigo;
    emergencia.emergenciaNombre = emergenciaNombre;
    emergencia.emergenciaInicio = new Date(emergenciaInicio.substring(6,10)+'-'+emergenciaInicio.substring(3,5)+'-'+emergenciaInicio.substring(0,2));
    emergencia.emergenciaFinal = new Date(emergenciaFinal.substring(6,10)+'-'+emergenciaFinal.substring(3,5)+'-'+emergenciaFinal.substring(0,2));
    emergencia.emergenciaDescripcion = emergenciaDescripcion;

    const tipoEmergencia = await tipoEmergenciaService.findById(tipoEmergenciaId);
    if (!tipoEmergencia) {
      res.status(400).json({ message: 'El Tipo de Emergencia que intenta asignar no existe' });
      return;
    }

    emergencia.tipoEmergencia = tipoEmergencia;

    const emergenciaErrors = await validate(emergencia);
    if (emergenciaErrors.length > 0) {
      res.status(400).send(emergenciaErrors);
      return;
    }

    try {
      await emergenciaService.create(emergencia);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear la Emergencia ' });
      return;
    }
    res.status(201).json({ message: 'Emergencia creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const emergenciaService = Container.get(EmergenciaService);
    const tipoEmergenciaService = Container.get(TipoEmergenciaService);
    const id: number = Number(req.params.id);
    const {
      emergenciaCodigo,
      emergenciaNombre,
      emergenciaInicio,
      emergenciaFinal,
      emergenciaDescripcion,
      tipoEmergenciaId,
  }: {
      emergenciaCodigo: string,
      emergenciaNombre: string,
      emergenciaInicio: string,
      emergenciaFinal: string,
      emergenciaDescripcion: string,
      tipoEmergenciaId: number,
  } = req.body;

    const emergencia = await emergenciaService.findById(id);
    if (!emergencia) {
      res.status(404).json({ message: 'Emergencia no encontrada ' });
      return;
    }

    emergencia.emergenciaCodigo = emergenciaCodigo;
    emergencia.emergenciaNombre = emergenciaNombre;
    emergencia.emergenciaInicio = new Date(emergenciaInicio.substring(6,10)+'-'+emergenciaInicio.substring(3,5)+'-'+emergenciaInicio.substring(0,2));
    emergencia.emergenciaFinal = new Date(emergenciaFinal.substring(6,10)+'-'+emergenciaFinal.substring(3,5)+'-'+emergenciaFinal.substring(0,2));
    emergencia.emergenciaDescripcion = emergenciaDescripcion;

    const tipoEmergencia = await tipoEmergenciaService.findById(tipoEmergenciaId);
    if (!tipoEmergencia) {
      res.status(400).json({ message: 'El Tipo de Emergencia que intenta asignar no existe' });
      return;
    }

    emergencia.tipoEmergencia = tipoEmergencia;

    const emergenciaErrors = await validate(emergencia);
    if (emergenciaErrors.length > 0) {
      res.status(400).send(emergenciaErrors);
      return;
    }

    try {
      await emergenciaService.update(emergencia);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar la Emergencia' });
      return;
    }

    res.status(200).json({ message: 'Emergencia actualizada' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const emergenciaService = Container.get(EmergenciaService);
    const emergencia = await emergenciaService.findById(id);
    if (!emergencia) {
      res.status(404).json({ message: 'Emergencia no encontrada ' });
      return;
    }
    const { ...rest} = emergencia;
    res.status(200).send({
      ...rest,
      emergenciaInicio: rest.emergenciaInicio.toISOString().substring(8, 10) + '/' + rest.emergenciaInicio.toISOString().substring(5, 7) + '/' + rest.emergenciaInicio.toISOString().substring(0, 4),
      emergenciaFinal: rest.emergenciaFinal.toISOString().substring(8, 10) + '/' + rest.emergenciaFinal.toISOString().substring(5, 7) + '/' + rest.emergenciaFinal.toISOString().substring(0, 4),
    });
  }

  static destroy = async (req: Request, res: Response) => {
    const emergenciaService = Container.get(EmergenciaService);
    const id: number = Number(req.params.id);
    const emergencia = await emergenciaService.findById(id);
    if (!emergencia) {
      res.status(404).json({ message: 'Emergencia no encontrada' });
      return;
    }
    await emergenciaService.delete(id);
    res.status(204).send();
  }
}

export default EmergenciaController;
