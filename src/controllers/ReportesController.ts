import { Request, Response } from 'express';
import { EmergenciaService } from '../services/EmergenciaService';
import { EmergenciaRealizadaService } from '../services/EmergenciaRealizadaService';
import { Container } from "typedi";

class ReportesController {
  static fetch = async (req: Request, res: Response) => {
    const emergenciaService = Container.get(EmergenciaService);
    const roles = await emergenciaService.findAll();
    res.status(200).send(roles);
  }

  /*static list = async (req: Request, res: Response) => {
    const emergenciaService = Container.get(EmergenciaService);
    const emergenciasEncontradas = await emergenciaService.listAll();
    let aux = emergenciasEncontradas.map(att => {
      return { nombreCompuesto: (att.departamento.departamentoNombre + ', ' + att.municipio.municipioNombre), ...att };
    });
    res.status(200).send(aux);
  }*/

  static listFechaSede = async (req: Request, res: Response) => {
    const emergenciaService = Container.get(EmergenciaRealizadaService);
    const { id, fechaInicio, fechaFin }: { id: number, fechaInicio: string, fechaFin: string } = req.body;
    const fechaIniIso = new Date(fechaInicio.substring(6, 10) + '-' + fechaInicio.substring(3, 5) + '-' + fechaInicio.substring(0, 2));
    const fechaFinIso = new Date(fechaFin.substring(6, 10) + '-' + fechaFin.substring(3, 5) + '-' + fechaFin.substring(0, 2));

    const emergenciasEncontradas = await emergenciaService.findByIdUbicacion(id, fechaIniIso.toISOString(), fechaFinIso.toISOString());
    
    res.status(200).send({
      data: emergenciasEncontradas,
      total: emergenciasEncontradas.length,
    });
  }
}

export default ReportesController;
