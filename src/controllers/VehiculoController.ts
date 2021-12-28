import { VehiculoService } from '../services/VehiculoService';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import { Vehiculo } from '../entities/Vehiculo';
import { validate } from 'class-validator';

class VehiculoController {
  static fetch = async (req: Request, res: Response) => {
    const vehiculoService = Container.get(VehiculoService);
    const vehiculoList = await vehiculoService.findAll();
    res.status(200).send(vehiculoList);
  }

  static list = async (req: Request, res: Response) => {
    const vehiculoService = Container.get(VehiculoService);
    const vehiculoList = await vehiculoService.listAll();
    res.status(200).send(vehiculoList);
  }

  static store = async (req: Request, res: Response) => {
    const vehiculoService = Container.get(VehiculoService);
    const {
      nombreVehiculo,
      kilometraje,
      fechaCreacion,
  }: {
      nombreVehiculo: string,
      kilometraje: string,
      fechaCreacion: string,
  } = req.body;


    const vehiculo = new Vehiculo();
    vehiculo.nombreVehiculo = nombreVehiculo;
    vehiculo.kilometraje = kilometraje;
    vehiculo.fechaCreacion = new Date(fechaCreacion.substring(6,10)+'-'+fechaCreacion.substring(3,5)+'-'+fechaCreacion.substring(0,2));
    
    const vehiculoErrors = await validate(vehiculo);
    if (vehiculoErrors.length > 0) {
      res.status(400).send(vehiculoErrors);
      return;
    }

    try {
      await vehiculoService.create(vehiculo);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el Vehiculo ' });
      return;
    }
    res.status(201).json({ message: 'Vehiculo creada correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const vehiculoService = Container.get(VehiculoService);
    const id: number = Number(req.params.id);
    const {
      nombreVehiculo,
      kilometraje,
      fechaCreacion,
  }: {
      nombreVehiculo: string,
      kilometraje: string,
      fechaCreacion: string,
  } = req.body;

    const vehiculo = await vehiculoService.findById(id);
    if (!vehiculo) {
      res.status(404).json({ message: 'Vehiculo no encontrado ' });
      return;
    }

    vehiculo.nombreVehiculo = nombreVehiculo;
    vehiculo.kilometraje = kilometraje;
    vehiculo.fechaCreacion = new Date(fechaCreacion.substring(6,10)+'-'+fechaCreacion.substring(3,5)+'-'+fechaCreacion.substring(0,2));

    const vehiculoErrors = await validate(vehiculo);
    if (vehiculoErrors.length > 0) {
      res.status(400).send(vehiculoErrors);
      return;
    }

    try {
      await vehiculoService.update(vehiculo);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el Vehiculo' });
      return;
    }

    res.status(200).json({ message: 'Vehiculo actualizado' });
  }

  static show = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const vehiculoService = Container.get(VehiculoService);
    const vehiculo = await vehiculoService.findById(id);
    if (!vehiculo) {
      res.status(404).json({ message: 'Vehiculo no encontrado ' });
      return;
    }

    const { ...rest} = vehiculo;

    res.status(200).send({
      ...rest,
      fechaCreacion:rest.fechaCreacion.toISOString().substring(8,10)+'/'+rest.fechaCreacion.toISOString().substring(5,7)+'/'+rest.fechaCreacion.toISOString().substring(0,4),
    });
  }

  static destroy = async (req: Request, res: Response) => {
    const vehiculoService = Container.get(VehiculoService);
    const id: number = Number(req.params.id);
    const tipoVoluntario = await vehiculoService.findById(id);
    if (!tipoVoluntario) {
      res.status(404).json({ message: 'Vehiculo no encontrado' });
      return;
    }
    await vehiculoService.delete(id);
    res.status(204).send();
  }
}

export default VehiculoController;
