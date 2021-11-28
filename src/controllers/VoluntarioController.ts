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
        res.status(200).send(student);
    }

    static store = async (req: Request, res: Response) => {
        const sedeService = Container.get(SedeService);
        const cuerpoFilialService = Container.get(CuerpoFilialService);
        const voluntarioService = Container.get(VoluntarioService);
        const modalidadService = Container.get(ModalidadService);
        const estadoService = Container.get(EstadoService);
        const tipoVoluntarioService = Container.get(TipoVoluntarioService);

        const {
            username,
            firstName,
            lastName,
            code,
            status,
            sedeId,
            modalityId,
            sectionId,
            gradeId,

        }: {
            username: string,
            code: string,
            year: number,
            report: string,
            firstName: string,
            lastName: string,
            status: boolean,
            sedeId: number,
            modalityId: number,
            sectionId: number,
            gradeId: number,
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
        const cuerpoFilial = await cuerpoFilialService.findById(sectionId);
        if (!cuerpoFilial) {
            res.status(400).json({ message: 'La sección que intenta asignar no existe' });
            return;
        }

        //Getting grade information
        const tipoVoluntario = await tipoVoluntarioService.findById(gradeId);
        if (!tipoVoluntario) {
            res.status(400).json({ message: 'El grado que intenta asignar no existe' });
            return;
        }

        const estado = await estadoService.findById(gradeId);
        if (!estado) {
            res.status(400).json({ message: 'El grado que intenta asignar no existe' });
            return;
        }

        //Setting person information
        const persona = new Persona();
        persona.username = username;
        persona.firstName = firstName;
        persona.lastName = lastName;
        persona.estado = status;

        const personErrors = await validate(persona);

        if (personErrors.length > 0) {
            res.status(400).send(personErrors);
            return;
        }

        const voluntario = new Voluntario();

        voluntario.aniosServicio = 0;
        voluntario.voluntarioCodigo = code;
        voluntario.tipoVoluntario = tipoVoluntario;
        voluntario.modalidad = modalidad;
        voluntario.estado = estado;
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

        const {
            id,
            firstName,
            lastName,
            sedeId,
            modalityId,
            cuerpoFilialId,
            tipoVoluntarioId,
            estadoId,
            username,
            code,
        }: {
            id: string,
            year: number,
            report: string,
            firstTime: boolean,
            firstName: string,
            lastName: string,
            status: boolean,
            sedeId: number,
            modalityId: number,
            cuerpoFilialId: number,
            tipoVoluntarioId: number,
            estadoId: number,
            username?: string,
            code?: string,
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

        const estado = await estadoService.findById(estadoId);
        if (!estado) {
            res.status(400).json({ message: 'El grado que intenta asignar no existe' });
            return;
        }

        //Setting person information
        if (username) {
            student.persona.username = username;
        }
        student.persona.firstName = firstName;
        student.persona.lastName = lastName;
        student.estado = estado;
        student.sede = sede;

        const personErrors = await validate(student.persona);

        if (personErrors.length > 0) {
            res.status(400).send(personErrors);
            return;
        }

        if (code) {
            student.voluntarioCodigo = code;
        }
        student.estado = estado;
        student.cuerpoFilial = cuerpoFilial;
        student.modalidad = modalidad;
        student.sede = sede;
        student.tipoVoluntario = tipoVoluntario;

        const studentErrors = await validate(student);
        if (studentErrors.length > 0) {
            res.status(400).send(studentErrors);
            return;
        }

        try {
            await voluntarioService.update(student);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo actualizar el estudiante ' })
            return;
        }

        res.status(200).send('Estudiante actualizado correctamente');
    }

    static destroy = async (req: Request, res: Response) => {
        const voluntarioService = Container.get(VoluntarioService);
        const id: string = String(req.params.id);

        const student = await voluntarioService.findById(id);
        if (!student) {
            res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        await voluntarioService.delete(id);
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
        const { sede, persona, tipoVoluntario, cuerpoFilial, modalidad, estado,...rest } = student;

        const modules = {}

        const studentData = {
            ...rest,
            ...persona,
            id: rest.id,
            modality: modalidad.modalidad,
            tipoVoluntario: tipoVoluntario.tipo,
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
    /*
    static saveNotes = async (req: Request, res: Response) => {
        const qualificationService = Container.get(QualificationService);
        const userService = Container.get(UserService);
        // const id: number = Number(req.params.id);
        const { qualificationId, userId, note, recoveryLink, recoveryEnabled }: { qualificationId: number, userId: number, note: number, recoveryLink: string, recoveryEnabled: boolean } = req.body;

        const user = await userService.findByIdWithRelations(+userId);

        const qualification = await qualificationService.findById(qualificationId);
        if (!qualification) {
            res.status(400).json({ message: 'Error al actualizar la nota', error: 'Qualification not found' });
            return;
        }

        qualification.note = note;
        qualification.approved = +note >= 6.0;
        if (recoveryLink) {
            qualification.recoverLink = recoveryLink;
        }
        qualification.recoverEnabled = recoveryEnabled ? recoveryEnabled : false;
        if (user) {
            qualification.updatedBy = `${user.person.firstName} ${user.person.lastName}`
        }

        try {
            await qualificationService.update(qualification);
        } catch (e) {
            res.status(400).json({ message: 'No se pudo actualizar la nota' });
            return;
        }

        res.status(200).json({ message: 'Nota actualizada correctamente' });
    }*/

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