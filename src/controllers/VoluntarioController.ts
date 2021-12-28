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
import { EmergenciasAsignadas } from '../entities/EmergenciasAsignadas';
import { EmergenciasAsignadasService } from '../services/EmergenciasAsignadasService';
import { EmergenciaService } from '../services/EmergenciaService';
//import { UsuarioService } from '../services/UsuarioService';
//import { TipoVoluntario } from '../entities/TipoVoluntario';

class VoluntarioController {
    static fetch = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const students = await voluntarioService.findAll();
        res.status(200).send(students);
    }

    static show = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const id: string = String(req.params.id);

        const student = await voluntarioService.findByIdWithRelation(id);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado ' });
            return;
        }
        const years = await voluntarioService.findByIdYearsOfService(id);
        const edad = await voluntarioService.findByIdYearsOldOfService(id);

        const { persona, ...rest } = student;

        res.status(200).send({
            ...rest,
            ...persona,
            id: student.id,
            fechaInicio: rest.fechaInicio.toISOString().substring(8,10)+'/'+rest.fechaInicio.toISOString().substring(5,7)+'/'+rest.fechaInicio.toISOString().substring(0,4),
            fechaNacimiento: persona.fechaNacimiento.toISOString().substring(8,10)+'/'+persona.fechaNacimiento.toISOString().substring(5,7)+'/'+persona.fechaNacimiento.toISOString().substring(0,4),
            edad: edad.aniosServicio,
            aniosServicio: years.aniosServicio
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

        const studentErrors = await validate(voluntario);
        if (studentErrors.length > 0) {
            res.status(400).send(studentErrors);
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

        //Getting student information
        const student = await voluntarioService.findById(id);
        if (!student) {
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

        student.persona.fechaNacimiento = new Date(fechaNacimiento.substring(6,10)+'-'+fechaNacimiento.substring(3,5)+'-'+fechaNacimiento.substring(0,2));
        student.persona.documentoIdentificacion = documentoIdentificacion;
        student.persona.tipoDocumentoPersona = tipoDocumentoPersona;
        student.persona.firstName = firstName;
        student.persona.lastName = lastName;
        student.persona.genero = genero;
        student.persona.email = email;
        student.persona.estadoPersona = estadoPersona;
        student.estado = estadoR;
        student.sede = sede;

        const personErrors = await validate(student.persona);

        if (personErrors.length > 0) {
            res.status(400).send(personErrors);
            return;
        }

        if (voluntarioCodigoCarnet) {
            student.voluntarioCodigoCarnet = voluntarioCodigoCarnet;
        }
        student.estado = estadoR;
        student.cuerpoFilial = cuerpoFilial;
        student.modalidad = modalidad;
        student.fechaInicio = new Date(fechaInicio.substring(6,10)+'-'+fechaInicio.substring(3,5)+'-'+fechaInicio.substring(0,2));
        student.sede = sede;
        student.tipoVoluntario = tipoVoluntario;

        const studentErrors = await validate(student);
        if (studentErrors.length > 0) {
            res.status(400).send(studentErrors);
            return;
        }

        try {
            await voluntarioService.update(student);
            await personaService.update(student.persona);
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

        const student = await voluntarioService.findById(id);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado ' })
            return;
        }

        student.persona.estadoPersona = false;

        try {
            await voluntarioService.update(student);
            await personaService.update(student.persona);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo eliminar el estudiante ' })
            return;
        }
        res.status(204).send();
    }

    static updateContact = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const personService = Container.get(PersonaService);
        const studentId = res.locals.jwtPayload.studentId;
        const { username, firstName, lastName }: { username: string, firstName: string, lastName: string } = req.body;

        const student = await voluntarioService.findByIdWithRelation(studentId);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
            return;
        }

        const person = await personService.findByIdWithRelation(student.persona.id);
        if (!person) {
            res.status(404).json({ message: 'Estudiante no encontrado ' });
            return;
        }

        person.username = username ? username : 'vacio';
        person.firstName = firstName ? firstName : 'vacio';
        person.lastName = lastName ? lastName : 'vacio';

        const personErrors = await validate(student.persona);

        if (personErrors.length > 0) {
            res.status(400).send(personErrors);
            return;
        }

        console.log('Person: ', person);
        console.log('Student: ', student);

        student.persona = person;

        const studentErrors = await validate(student);
        if (studentErrors.length > 0) {
            res.status(400).send(studentErrors);
            return;
        }

        try {
            await personService.update(person);
            await voluntarioService.update(student);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo actualizar el contacto del estudiante', error })
            return;
        }

        res.status(200).json({ message: 'Contacto de estudiante actualizado correctamente' });
    }

    static me = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const code = res.locals.jwtPayload.code;

        const student = await voluntarioService.findByCode(code);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
            return;
        }

        const { persona, ...rest } = student;

        res.status(200).send({
            ...rest,
            ...persona,
            id: rest.id,
        });
    }

    static showByCode = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const code = res.locals.jwtPayload.code;

        const student = await voluntarioService.findByCodeWithRelation(code);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
            return;
        }
        const { sede, persona, tipoVoluntario, cuerpoFilial, modalidad, estado, ...rest } = student;

        const modules = {}

        const studentData = {
            ...rest,
            ...persona,
            id: rest.id,
            modality: modalidad.nombreModalidad,
            nombreTipoVoluntario: tipoVoluntario.nombreTipoVoluntario,
            cuerpoFilial: cuerpoFilial.nombreCuerpoFilial,
        }

        res.status(200).send({
            ...studentData,
            modules,
        });
    }

    /*static fetchNotes = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(voluntarioService);

        const id: number = Number(req.params.id);

        const student = await voluntarioService.findByIdWithNotesRelations(id);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
            return;
        }
        // @ts-ignore
        const { subjectQualifications, person, ...rest } = student;

        const modules = {}

        subjectQualifications.map((s) => {
            s.qualifications.map((q) => {
                const moduleName = +q.module.moduleNumber === 6984 ? 'externalTest' : q.module.moduleNumber;
                if (!modules[q.module.moduleNumber]) {
                    Reflect.set(modules, moduleName, []);
                }
                const { module, ...res } = q;

                modules[moduleName].push({
                    module: moduleName,
                    subject: s.subject.name,
                    ...res,
                })
            })
        })

        res.status(200).send({
            ...modules,
        });
    }*/
    static saveNotes = async (req: Request, res: Response) => {
        const qualificationService = Container.get(EmergenciasAsignadasService);
        const emergenciaService = Container.get(EmergenciaService);
        const userService = Container.get(VoluntarioService);
        // const id: number = Number(req.params.id);
        const { qualificationId, userId, note, recoveryLink, recoveryEnabled }: { qualificationId: number, userId: string, note: number, recoveryLink: string, recoveryEnabled: boolean } = req.body;

        const user = await userService.findByCodeWithRelation(userId);

        let emergenciaAsignadaAux = new EmergenciasAsignadas();

        const qualification = await qualificationService.findById(qualificationId);
        if (!qualification) {
            res.status(400).json({ message: 'Error al actualizar la nota', error: 'Qualification not found' });
            return;
        }
        
        const emergencia = await emergenciaService.findById(qualificationId);
        if (!emergencia) {
            res.status(400).json({ message: 'Error al actualizar la nota', error: 'Qualification not found' });
            return;
        }

        if(!user){
            res.status(400).json({ message: 'Error al actualizar la nota', error: 'Qualification not found' });
            return;
        }

        if(!user.emergenciasAsignadas){
            res.status(400).json({ message: 'Error al actualizar la nota', error: 'Qualification not found' });
            return;
        }

        user.emergenciasAsignadas.find(emergenciaAsignada => emergenciaAsignada.emergencia.id = qualificationId);
        user.emergenciasAsignadas = user.emergenciasAsignadas.filter(category => {
            return category.emergencia.id !== qualificationId;
        });

        
        emergenciaAsignadaAux.emergencia = emergencia;
        emergenciaAsignadaAux.voluntario = user;

        user.emergenciasAsignadas.push(emergenciaAsignadaAux);

        try {
            await userService.update(user);
        } catch (e) {
            res.status(400).json({ message: 'No se pudo actualizar la nota' });
            return;
        }

        res.status(200).json({ message: 'Nota actualizada correctamente' });
    }

    /*static subjects = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(voluntarioService);
        const subjectService = Container.get(SubjectService);
        const id: number = Number(req.params.id);

        const student = await voluntarioService.findByIdWithRelation(id);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado ' });
            return;
        }

        const gradeId = student.grade.id;

        let subjects: Subject[];
        try {
            subjects = await subjectService.listAllByGrade(gradeId);
            res.status(200).send(subjects);
            return;
        } catch (e) {
            res.status(500).json({ message: 'Error obteniendo las materias', errors: e });
            return;
        }
    }
*/
    /*static publishInstitutionalAverage = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(voluntarioService);

        const id: number = Number(req.params.id);

        const student = await voluntarioService.findByIdWithNotesRelations(id);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
            return;
        }
        // @ts-ignore
        const { subjectQualifications, person, ...rest } = student;

        let notes: number[] = [];

        subjectQualifications.map((s) => {
            s.qualifications.map((q) => {
                if (+q.module.moduleNumber !== 6984) {
                    notes.push(q.note);
                }
            })
        })

        const length = notes.length;

        const sum = notes.reduce((a: number, b: number) => Number(a) + Number(b));

        const average = sum / length;
        student.institutionalAverage = average;

        try {
            await voluntarioService.update(student);
        } catch (e) {
            res.status(400).json({ message: 'No se pudieron actualizar las notas', error: e });
            return;
        }

        res.status(200).send('Notas publicadas correctamente');
    }*/

    /*static publishFinalAverage = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(voluntarioService);

        const id: number = Number(req.params.id);

        const student = await voluntarioService.findByIdWithNotesRelations(id);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
            return;
        }
        // @ts-ignore
        const { subjectQualifications, person, ...rest } = student;

        let externalAverage: number = 0;

        subjectQualifications.map((s) => {
            s.qualifications.map((q) => {
                if (+q.module.moduleNumber === 6984) {
                    externalAverage = +q.note;
                }
            })
        })

        const finalAverage = ((student.institutionalAverage || 0) * student.grade.institutionalPercentage) + ((externalAverage || 0) * student.grade.externalPercentage);

        student.finalAverage = finalAverage;

        student.approved = finalAverage > 6.00;

        try {
            await voluntarioService.update(student);
        } catch (e) {
            res.status(400).json({ message: 'No se pudieron actualizar las notas', error: e });
            return;
        }

        res.status(200).send('Notas publicadas correctamente');
    }*/
}

export default VoluntarioController;