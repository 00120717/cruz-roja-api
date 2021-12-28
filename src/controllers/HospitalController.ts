import { HospitalService } from '../services/HospitalService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Hospital } from '../entities/Hospital';
import { validate } from 'class-validator';

class HospitalController {
  static fetch = async (req: Request, res: Response) => {
    const hospitalService = Container.get(HospitalService);
    const hospitalList = await hospitalService.findAll();
    res.status(200).send(hospitalList);
  }

  static list = async (req: Request, res: Response) => {
    const hospitalService = Container.get(HospitalService);
    const hospitalList = await hospitalService.listAll();
    res.status(200).send(hospitalList);
  }

  static store = async (req: Request, res: Response) => {
    const hospitalService = Container.get(HospitalService);
    const {
      nombreHospital,
      codigoHospital,
      fechaCreacion,
  }: {
      nombreHospital: string,
      codigoHospital: string,
      fechaCreacion: string,
  } = req.body;


    const hospital = new Hospital();
    hospital.nombreHospital = nombreHospital;
    hospital.codigoHospital = codigoHospital;
    hospital.fechaCreacion = new Date(fechaCreacion.substring(6,10)+'-'+fechaCreacion.substring(3,5)+'-'+fechaCreacion.substring(0,2));
    
    const hospitalErrors = await validate(hospital);
    if (hospitalErrors.length > 0) {
      res.status(400).send(hospitalErrors);
      return;
    }

    try {
      await hospitalService.create(hospital);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el Hospital ' });
      return;
    }
    res.status(201).json({ message: 'Hospital creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const hospitalService = Container.get(HospitalService);
    const id: number = Number(req.params.id);
    const {
      nombreHospital,
      codigoHospital,
      fechaCreacion,
  }: {
      nombreHospital: string,
      codigoHospital: string,
      fechaCreacion: string,
  } = req.body;

    const hospital = await hospitalService.findById(id);
    if (!hospital) {
      res.status(404).json({ message: 'Hospital no encontrado ' });
      return;
    }

    hospital.nombreHospital = nombreHospital;
    hospital.codigoHospital = codigoHospital;
    hospital.fechaCreacion = new Date(fechaCreacion.substring(6,10)+'-'+fechaCreacion.substring(3,5)+'-'+fechaCreacion.substring(0,2));

    const hospitalErrors = await validate(hospital);
    if (hospitalErrors.length > 0) {
      res.status(400).send(hospitalErrors);
      return;
    }

    try {
      await hospitalService.update(hospital);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el Hospital' });
      return;
    }

    res.status(200).json({ message: 'Hospital actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const hospitalService = Container.get(HospitalService);
    const hospital = await hospitalService.findById(id);
    if (!hospital) {
      res.status(404).json({ message: 'Hospital no encontrado ' });
      return;
    }

    const {...rest} = hospital;

    res.status(200).send({
      ...rest,
      fechaCreacion:rest.fechaCreacion.toISOString().substring(8,10)+'/'+rest.fechaCreacion.toISOString().substring(5,7)+'/'+rest.fechaCreacion.toISOString().substring(0,4),
    });
  }

  static destroy = async (req: Request, res: Response) => {
    const hospitalService = Container.get(HospitalService);
    const id: number = Number(req.params.id);
    const tipoVoluntario = await hospitalService.findById(id);
    if (!tipoVoluntario) {
      res.status(404).json({ message: 'Hospital no encontrado' });
      return;
    }
    await hospitalService.delete(id);
    res.status(204).send();
  }
}

export default HospitalController;
