import { VoluntarioService } from './../services/VoluntarioService';
import { Request, Response } from "express";
import { Voluntario } from "../entities/Voluntario";
import { SedeService } from "../services/SedeService";
import { ModalidadService } from "../services/ModalidadService";
import { CuerpoFilialService } from "../services/CuerpoFilialService";
import { TipoVoluntarioService } from "../services/TipoVoluntarioService";
import { EstadoService } from "../services/EstadoService";
import { Persona } from "../entities/Persona";
import { validate } from "class-validator";
import { Container } from "typedi";
import { PersonaService } from "../services/PersonaService";

class VoluntarioController {
    static fetch = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const voluntarios = await voluntarioService.findAll();
        res.status(200).send(voluntarios);
    }

    static list = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const voluntarioList = await voluntarioService.listAll();
        let aux = voluntarioList.map(att =>{
            let { ...rest} = att;
            return {nombreCompuesto: (rest.persona.firstName+' '+rest.persona.lastName), ...rest };
        });
        res.status(200).send(aux);
    }

    static listSede = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const voluntarioList = await voluntarioService.findAllSede();

        res.status(200).send(voluntarioList);
    }

    static listCuerpoFilial = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const voluntarioList = await voluntarioService.findAllSede();

        res.status(200).send(voluntarioList);
    }

    static show = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const id: string = String(req.params.id);

        const voluntario = await voluntarioService.findByIdWithRelation(id);
        if (!voluntario) {
            res.status(404).json({ message: 'Voluntario no encontrado ' });
            return;
        }
        const years = await voluntarioService.findByIdYearsOfService(id);
        const edad = await voluntarioService.findByIdYearsOldOfService(id);

        const { persona, ...rest } = voluntario;

        res.status(200).send({
            ...rest,
            ...persona,
            id: voluntario.id,
            fechaInicio: rest.fechaInicio.toISOString().substring(8,10)+'/'+rest.fechaInicio.toISOString().substring(5,7)+'/'+rest.fechaInicio.toISOString().substring(0,4),
            fechaNacimiento: persona.fechaNacimiento.toISOString().substring(8,10)+'/'+persona.fechaNacimiento.toISOString().substring(5,7)+'/'+persona.fechaNacimiento.toISOString().substring(0,4),
            edad: edad.aniosServicio,
            aniosServicio: years.aniosServicio,
            nombreCompuesto : persona.firstName + ' ' + persona.lastName,
        });
        
    }

    static store = async (req: Request, res: Response) => {
        const sedeService = Container.get(SedeService);
        const cuerpoFilialService = Container.get(CuerpoFilialService);
        const voluntarioService = Container.get(VoluntarioService);
        const modalidadService = Container.get(ModalidadService);
        const estadoService = Container.get(EstadoService);
        const tipoVoluntarioService = Container.get(TipoVoluntarioService);

        const {
            documentoIdentificacion,
            tipoDocumentoPersona,
            fechaNacimiento,
            fechaInicio,
            voluntarioCodigoCarnet,
            genero,
            firstName,
            lastName,
            email,
            estadoPersona,
            sedeId,
            modalityId,
            cuerpoFilialId,
            tipoVoluntarioId,
            estadoId
        }: {
            documentoIdentificacion: string,
            tipoDocumentoPersona: string,
            fechaNacimiento: string,
            fechaInicio: string,
            voluntarioCodigoCarnet: string,
            genero: string,
            email: string,
            firstName: string,
            lastName: string,
            estadoPersona: boolean,
            sedeId: number,
            modalityId: number,
            cuerpoFilialId: number,
            tipoVoluntarioId: number,
            estadoId: number
        } = req.body;

        //Getting sede information
        const sede = await sedeService.findById(sedeId);
        if (!sede) {
            res.status(400).json({ message: 'La sede que intenta asignar no existe' });
            return;
        }

        //Getting modality information
        const modalidad = await modalidadService.findById(modalityId);
        if (!modalidad) {
            res.status(400).json({ message: 'La modalidad que intenta asignar no existe' });
            return;
        }

        //Getting section information
        const cuerpoFilial = await cuerpoFilialService.findById(cuerpoFilialId);
        if (!cuerpoFilial) {
            res.status(400).json({ message: 'La sección que intenta asignar no existe' });
            return;
        }

        //Getting grade information
        const tipoVoluntario = await tipoVoluntarioService.findById(tipoVoluntarioId);
        if (!tipoVoluntario) {
            res.status(400).json({ message: 'El grado que intenta asignar no existe' });
            return;
        }

        const estadoR = await estadoService.findById(estadoId);
        if (!estadoR) {
            res.status(400).json({ message: 'El grado que intenta asignar no existe' });
            return;
        }

        let split = firstName.split(' ');

        let username = '';
        split.forEach(x=>{
            username = username + x.substring(0,2);
        });

        split = lastName.split(' ');

        split.forEach(x=>{
            username = username + x.substring(0,2);
        });

        let flag = true;
        while(flag){
            const personaAux = await voluntarioService.findByUsername(username);
            if (!personaAux) {
                flag = false;
            }
            let min = Math.ceil(0);
            let max = Math.floor(9);
            username = username + String(Math.floor(Math.random() * (max - min) + min));
        }

        //Setting person information
        const persona = new Persona();
        persona.username = username;
        persona.documentoIdentificacion = documentoIdentificacion;
        persona.tipoDocumentoPersona = tipoDocumentoPersona;
        persona.firstName = firstName;
        persona.lastName = lastName;
        persona.estadoPersona = estadoPersona;
        persona.genero = genero;
        persona.email = email;
        persona.fechaNacimiento = new Date(fechaNacimiento.substring(6,10)+'-'+fechaNacimiento.substring(3,5)+'-'+fechaNacimiento.substring(0,2));

        const personErrors = await validate(persona);

        if (personErrors.length > 0) {
            res.status(400).send(personErrors);
            return;
        }

        const voluntario = new Voluntario();

        voluntario.fechaInicio = new Date(fechaInicio.substring(6,10)+'-'+fechaInicio.substring(3,5)+'-'+fechaInicio.substring(0,2));
        voluntario.voluntarioCodigoCarnet = voluntarioCodigoCarnet;
        voluntario.tipoVoluntario = tipoVoluntario;
        voluntario.modalidad = modalidad;
        voluntario.estado = estadoR;
        voluntario.persona = persona;
        voluntario.cuerpoFilial = cuerpoFilial;
        voluntario.sede = sede;

        const voluntarioErrors = await validate(voluntario);
        if (voluntarioErrors.length > 0) {
            res.status(400).send(voluntarioErrors);
            return;
        }

        try {
            await voluntarioService.create(voluntario);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo crear el estudiante ' })
            return;
        }

        res.status(201).send('Estudiante creado correctamente');
    }

    static update = async (req: Request, res: Response) => {
        const sedeService = Container.get(SedeService);
        const cuerpoFilialService = Container.get(CuerpoFilialService);
        const voluntarioService = Container.get(VoluntarioService);
        const modalidadService = Container.get(ModalidadService);
        const estadoService = Container.get(EstadoService);
        const tipoVoluntarioService = Container.get(TipoVoluntarioService);
        const personaService = Container.get(PersonaService);
        const id: string = String(req.params.id);

        const {
            documentoIdentificacion,
            tipoDocumentoPersona,
            fechaNacimiento,
            fechaInicio,
            voluntarioCodigoCarnet,
            genero,
            firstName,
            lastName,
            email,
            estadoPersona,
            sedeId,
            modalityId,
            cuerpoFilialId,
            tipoVoluntarioId,
            estadoId
        }: {
            documentoIdentificacion: string,
            tipoDocumentoPersona: string,
            fechaNacimiento: string,
            fechaInicio: string,
            voluntarioCodigoCarnet: string,
            genero: string,
            email: string,
            firstName: string,
            lastName: string,
            estadoPersona: boolean,
            sedeId: number,
            modalityId: number,
            cuerpoFilialId: number,
            tipoVoluntarioId: number,
            estadoId: number
        } = req.body;

        //Getting voluntario information
        const voluntario = await voluntarioService.findById(id);
        if (!voluntario) {
            res.status(404).json({ message: 'Estudiante no encontrado ' })
            return;
        }

        //Getting sede information
        const sede = await sedeService.findById(sedeId);
        if (!sede) {
            res.status(400).json({ message: 'La sede que intenta asignar no existe' });
            return;
        }

        //Getting modality information
        const modalidad = await modalidadService.findById(modalityId);
        if (!modalidad) {
            res.status(400).json({ message: 'La modalidad que intenta asignar no existe' });
            return;
        }

        //Getting section information
        const cuerpoFilial = await cuerpoFilialService.findById(cuerpoFilialId);
        if (!cuerpoFilial) {
            res.status(400).json({ message: 'La sección que intenta asignar no existe' });
            return;
        }

        //Getting grade information
        const tipoVoluntario = await tipoVoluntarioService.findById(tipoVoluntarioId);
        if (!tipoVoluntario) {
            res.status(400).json({ message: 'El grado que intenta asignar no existe' });
            return;
        }

        const estadoR = await estadoService.findById(estadoId);
        if (!estadoR) {
            res.status(400).json({ message: 'El grado que intenta asignar no existe' });
            return;
        }

        voluntario.persona.fechaNacimiento = new Date(fechaNacimiento.substring(6,10)+'-'+fechaNacimiento.substring(3,5)+'-'+fechaNacimiento.substring(0,2));
        voluntario.persona.documentoIdentificacion = documentoIdentificacion;
        voluntario.persona.tipoDocumentoPersona = tipoDocumentoPersona;
        voluntario.persona.firstName = firstName;
        voluntario.persona.lastName = lastName;
        voluntario.persona.genero = genero;
        voluntario.persona.email = email;
        voluntario.persona.estadoPersona = estadoPersona;
        voluntario.estado = estadoR;
        voluntario.sede = sede;

        const personErrors = await validate(voluntario.persona);

        if (personErrors.length > 0) {
            res.status(400).send(personErrors);
            return;
        }

        if (voluntarioCodigoCarnet) {
            voluntario.voluntarioCodigoCarnet = voluntarioCodigoCarnet;
        }
        voluntario.estado = estadoR;
        voluntario.cuerpoFilial = cuerpoFilial;
        voluntario.modalidad = modalidad;
        voluntario.fechaInicio = new Date(fechaInicio.substring(6,10)+'-'+fechaInicio.substring(3,5)+'-'+fechaInicio.substring(0,2));
        voluntario.sede = sede;
        voluntario.tipoVoluntario = tipoVoluntario;

        const voluntarioErrors = await validate(voluntario);
        if (voluntarioErrors.length > 0) {
            res.status(400).send(voluntarioErrors);
            return;
        }

        try {
            await voluntarioService.update(voluntario);
            await personaService.update(voluntario.persona);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo actualizar el estudiante ' })
            return;
        }

        res.status(200).send('Estudiante actualizado correctamente');
    }

    static destroy = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const personaService = Container.get(PersonaService);
        const id: string = String(req.params.id);

        const voluntario = await voluntarioService.findById(id);
        if (!voluntario) {
            res.status(404).json({ message: 'Estudiante no encontrado ' })
            return;
        }

        voluntario.persona.estadoPersona = false;

        try {
            await voluntarioService.update(voluntario);
            await personaService.update(voluntario.persona);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo eliminar el estudiante ' })
            return;
        }
        res.status(204).send();
    }

    static me = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const code = res.locals.jwtPayload.code;

        const voluntario = await voluntarioService.findByCode(code);
        if (!voluntario) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
            return;
        }

        const { persona, ...rest } = voluntario;

        res.status(200).send({
            ...rest,
            ...persona,
            id: rest.id,
        });
    }

    static showByCode = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const code = res.locals.jwtPayload.code;

        const voluntario = await voluntarioService.findByCodeWithRelation(code);
        if (!voluntario) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
            return;
        }
        const { sede, persona, tipoVoluntario, cuerpoFilial, modalidad, estado, ...rest } = voluntario;

        const modules = {}

        const voluntarioData = {
            ...rest,
            ...persona,
            id: rest.id,
            modality: modalidad.nombreModalidad,
            nombreTipoVoluntario: tipoVoluntario.nombreTipoVoluntario,
            cuerpoFilial: cuerpoFilial.nombreCuerpoFilial,
        }

        res.status(200).send({
            ...voluntarioData,
            modules,
        });
    }
}

export default VoluntarioController;