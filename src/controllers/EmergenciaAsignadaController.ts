import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { EmergenciasAsignadasService } from '../services/EmergenciasAsignadasService';
import { Container } from "typedi";
import { VoluntarioService } from '../services/VoluntarioService';
import { EmergenciaService } from '../services/EmergenciaService';
import { EmergenciasAsignadas } from '../entities/EmergenciasAsignadas';

class EmergenciaAsignadaController {
  static fetch = async (req: Request, res: Response) => {
    const emergenciasAsignadasService = Container.get(EmergenciasAsignadasService);
    const users = await emergenciasAsignadasService.findAll();
    res.status(200).send(users);
  };

  static show = async (req: Request, res: Response) => {
    const emergenciasAsignadasService = Container.get(EmergenciasAsignadasService);
    //Get the ID from the url
    const id: string = String(req.params.id);

    //Get the emergenciaAsignada from database
    const emergenciaAsignada = await emergenciasAsignadasService.findByIdWithRelation(id);
    if (!emergenciaAsignada) {
      res.status(404).json({ message: 'Usuario no encontrado ' });
      return;
    }
    const { voluntario, ...rest } = emergenciaAsignada;
    res.status(200).send({
      ...rest,
      ...voluntario,
      id: rest.id,
    });
  };

  static store = async (req: Request, res: Response) => {
    const emergenciasAsignadasService = Container.get(EmergenciasAsignadasService);
    const voluntarioService = Container.get(VoluntarioService);
    const emergenciaService = Container.get(EmergenciaService);

    const {
      voluntarioId,
      emergenciaId,
    }: {
      voluntarioId: Array<number>,
      emergenciaId: Array<number>,
    } = req.body;

    const emergencias = await emergenciaService.findByIds(emergenciaId);
    if (!emergencias) {
      res.status(400).json({ message: 'Las emergencias que intenta asignar no existen' });
      return;
    }

    const voluntarios = await voluntarioService.findByIds(voluntarioId);
    if (!voluntarios) {
      res.status(400).json({ message: 'La sede que intenta asignar no existe' });
      return;
    }

    const fecha = new Date();

    for (const voluntario of voluntarios) {
      for (const emergencia of emergencias) {
        const emergenciaAsignada = new EmergenciasAsignadas();
        emergenciaAsignada.voluntario = voluntario;
        emergenciaAsignada.emergencia = emergencia;
        emergenciaAsignada.unionEmergencia = fecha;

        const errors = await validate(emergenciaAsignada);
        let flag = true;
        if (errors.length > 0) {
          flag = false;
        }

        if (flag) {
          try {
            await emergenciasAsignadasService.create(emergenciaAsignada);
          } catch (error) {
          }
        }
      }
    }
    res.status(201).json({ message: 'Emergencias Asignadas correctamente' });
  };

  static destroy = async (req: Request, res: Response) => {
    const emergenciasAsignadasService = Container.get(EmergenciasAsignadasService);
    const id: string = String(req.params.id);

    const emergenciaAsignada = await emergenciasAsignadasService.findById(id);
    if (!emergenciaAsignada) {
      res.status(404).json({ message: 'Usuario no encontrado ' })
    }

    await emergenciasAsignadasService.delete(id);
    res.status(204).send();
  };
}

export default EmergenciaAsignadaController;
