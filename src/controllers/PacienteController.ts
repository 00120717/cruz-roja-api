import { PacienteService } from '../services/PacienteService';
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Container } from "typedi";
import { PersonaService } from "../services/PersonaService";

class PacienteController {
    static fetch = async (req: Request, res: Response) => {
        const pacienteService = Container.get(PacienteService);
        const pacientes = await pacienteService.findAll();
        res.status(200).send(pacientes);
    }

    static show = async (req: Request, res: Response) => {
        const pacienteService = Container.get(PacienteService);
        const id: string = String(req.params.id);

        const paciente = await pacienteService.findById(id);
        if (!paciente) {
            res.status(404).json({ message: 'Paciente no encontrado ' });
            return;
        }

        const { persona, ...rest } = paciente;

        res.status(200).send({
            ...rest,
            ...persona,
            id: paciente.id,
        });
        
    }

    static update = async (req: Request, res: Response) => {
        const pacienteService = Container.get(PacienteService);
        const personaService = Container.get(PersonaService);
        const id: string = String(req.params.id);

        const {
            menorEdad,
            alergias,
            telefonoEncargado,
            identificado,
            condicionesPermanentes,
            identificadorPersonal,
            documentoIdentificacion,
            tipoDocumentoPersona,
            fechaNacimiento,
            genero,
            firstName,
            lastName,
            estadoPersona,
        }: {
            menorEdad: boolean,
            alergias: string,
            telefonoEncargado: string,
            identificado: boolean,
            condicionesPermanentes: string,
            identificadorPersonal: string,
            documentoIdentificacion: string,
            tipoDocumentoPersona: string,
            fechaNacimiento: string,
            genero: string,
            firstName: string,
            lastName: string,
            estadoPersona: boolean,
        } = req.body;

        //Getting paciente information
        const paciente = await pacienteService.findById(id);
        if (!paciente) {
            res.status(404).json({ message: 'Paciente no encontrado ' })
            return;
        }

        paciente.persona.fechaNacimiento = new Date(fechaNacimiento.substring(6,10)+'-'+fechaNacimiento.substring(3,5)+'-'+fechaNacimiento.substring(0,2));
        paciente.persona.documentoIdentificacion = documentoIdentificacion;
        paciente.persona.tipoDocumentoPersona = tipoDocumentoPersona;
        paciente.persona.firstName = firstName;
        paciente.persona.lastName = lastName;
        paciente.persona.genero = genero;
        paciente.persona.estadoPersona = estadoPersona;

        const personErrors = await validate(paciente.persona);

        if (personErrors.length > 0) {
            res.status(400).send(personErrors);
            return;
        }

        paciente.menorEdad = menorEdad;
        paciente.alergias = alergias;
        paciente.telefonoEncargado = telefonoEncargado;
        paciente.identificado = identificado;
        paciente.condicionesPermanentes = condicionesPermanentes;
        paciente.identificadorPersonal = identificadorPersonal;


        const pacienteErrors = await validate(paciente);
        if (pacienteErrors.length > 0) {
            res.status(400).send(pacienteErrors);
            return;
        }

        try {
            await pacienteService.update(paciente);
            await personaService.update(paciente.persona);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo actualizar el paciente ' })
            return;
        }

        res.status(200).send('Paciente actualizado correctamente');
    }

    static destroy = async (req: Request, res: Response) => {
        const pacienteService = Container.get(PacienteService);
        const id: string = String(req.params.id);

        const paciente = await pacienteService.findById(id);
        if (!paciente) {
            res.status(404).json({ message: 'Paciente no encontrado ' })
            return;
        }

        try {
            await pacienteService.delete(paciente.id);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo eliminar el paciente ' })
            return;
        }
        res.status(204).send();
    }

}

export default PacienteController;