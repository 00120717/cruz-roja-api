import { VoluntarioService } from '../services/VoluntarioService';
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Container } from "typedi";
import { EmergenciaRealizadaService } from '../services/EmergenciaRealizadaService';
import { PacienteVehiculoHospital } from '../auxiliar-models/PacienteVehiculoHospital';
import { SeccionalService } from '../services/SeccionalService';
import { EmergenciaRealizada } from '../entities/EmergenciaRealizada';
import { VehiculoXEmergenciaPaciente } from '../entities/VehiculoXEmergenciaPaciente';
import { VehiculoService } from '../services/VehiculoService';
import { HospitalService } from '../services/HospitalService';
import { EmergenciaPaciente } from '../entities/EmergenciaPaciente';
import { Paciente } from '../entities/Paciente';
import { EmergenciaPacienteService } from '../services/EmergenciaPacienteService';
import { EmergenciaSeccional } from '../entities/EmergenciaSeccional';
import { PacienteService } from '../services/PacienteService';
import { EmergenciaService } from '../services/EmergenciaService';
import { VehiculoXEmergenciaPacienteService } from '../services/VehiculoXEmergenciaPacienteService';
import { EmergenciaSeccionalService } from '../services/EmergenciaSeccionalService';
import { Persona } from '../entities/Persona';
//import { UsuarioService } from '../services/UsuarioService';
//import { TipoVoluntario } from '../entities/TipoVoluntario';

class EmergenciaRealizadaController {
    static fetch = async (req: Request, res: Response) => {
        const emergenciaRealizadaService = Container.get(EmergenciaRealizadaService);
        const emergenciasRealizadas = await emergenciaRealizadaService.findAll();
        let aux = emergenciasRealizadas.data.map(att => {
            let { ...rest } = att;
            return {
                fechaRealizada: rest.fechaRealizada.toISOString(),
                fechaHoraLlamada: rest.fechaHoraLlamada.toISOString().substring(11, 16),
                ...rest
            };
        });

        emergenciasRealizadas.data = aux;

        res.status(200).send(emergenciasRealizadas);
    }

    static listFechaUbicacion = async (req: Request, res: Response) => {
        const emergenciaService = Container.get(EmergenciaRealizadaService);
        const id: number = Number(req.params.id);
        const fechaInicio: string = String(req.params.fechaInicio);
        const fechaFin: string = String(req.params.fechaFin);

        const fechaIniIso = new Date(fechaInicio.substring(6, 10) + '-' + fechaInicio.substring(3, 5) + '-' + fechaInicio.substring(0, 2));
        const fechaFinIso = new Date(fechaFin.substring(6, 10) + '-' + fechaFin.substring(3, 5) + '-' + fechaFin.substring(0, 2));

        const emergenciasEncontradas = await emergenciaService.findByIdUbicacion(id, fechaIniIso.toISOString(), fechaFinIso.toISOString());

        res.status(200).send(emergenciasEncontradas);
    }

    static listFechaTipo = async (req: Request, res: Response) => {
        const emergenciaService = Container.get(EmergenciaRealizadaService);
        const id: number = Number(req.params.id);
        const fechaInicio: string = String(req.params.fechaInicio);
        const fechaFin: string = String(req.params.fechaFin);

        const fechaIniIso = new Date(fechaInicio.substring(6, 10) + '-' + fechaInicio.substring(3, 5) + '-' + fechaInicio.substring(0, 2));
        const fechaFinIso = new Date(fechaFin.substring(6, 10) + '-' + fechaFin.substring(3, 5) + '-' + fechaFin.substring(0, 2));

        const emergenciasEncontradas = await emergenciaService.findByIdTipo(id, fechaIniIso.toISOString(), fechaFinIso.toISOString());

        res.status(200).send(emergenciasEncontradas);
    }

    static listAll = async (req: Request, res: Response) => {
        const emergenciaService = Container.get(EmergenciaRealizadaService);
        const emergenciasEncontradas = await emergenciaService.findAllReportes();

        res.status(200).send(emergenciasEncontradas);
    }

    static show = async (req: Request, res: Response) => {
        const emergenciaRealizadaService = Container.get(EmergenciaRealizadaService);
        const voluntarioService = Container.get(VoluntarioService);
        const emergenciaPacienteService = Container.get(EmergenciaPacienteService);
        const id: string = String(req.params.id);

        const emergenciaRealizada = await emergenciaRealizadaService.findByIdWithRelation(id);
        if (!emergenciaRealizada) {
            res.status(404).json({ message: 'Emergencia Realizada no encontrada ' });
            return;
        }

        const { ...rest } = emergenciaRealizada;

        let emergenciaPacienteArray: EmergenciaPaciente[] = [];

        for (const emergenciaPacienteAux of rest.emergenciaPaciente) {
            let emergenciaPacienteRelation = await emergenciaPacienteService.findById(emergenciaPacienteAux.id);
            if (emergenciaPacienteRelation) {
                for (const vehiculoXemergenciaPacienteAux of emergenciaPacienteRelation.vehiculoXEmergenciaPaciente) {
                    let voluntario = await voluntarioService.findByIdWithRelation(vehiculoXemergenciaPacienteAux.voluntario.id);
                    if (voluntario) {
                        vehiculoXemergenciaPacienteAux.voluntario = voluntario;
                    }
                }
                emergenciaPacienteArray.push(emergenciaPacienteRelation)
            }
            else {
                for (const vehiculoXemergenciaPacienteAux of emergenciaPacienteAux.vehiculoXEmergenciaPaciente) {
                    let voluntario = await voluntarioService.findByIdWithRelation(vehiculoXemergenciaPacienteAux.voluntario.id);
                    if (voluntario) {
                        vehiculoXemergenciaPacienteAux.voluntario = voluntario;
                    }
                }
                emergenciaPacienteArray.push(emergenciaPacienteAux)
            }
        }
        res.status(200).send({
            ...rest,
            id: emergenciaRealizada.id,
            fechaRealizada: rest.fechaRealizada.toISOString().substring(8, 10) + '/' + rest.fechaRealizada.toISOString().substring(5, 7) + '/' + rest.fechaRealizada.toISOString().substring(0, 4),
            fechaHoraLlamada: rest.fechaHoraLlamada.toISOString().substring(11, 16),
            emergenciaPaciente: emergenciaPacienteArray
        });

    }

    static store = async (req: Request, res: Response) => {
        const seccionalService = Container.get(SeccionalService);
        const emergenciaRealizadaService = Container.get(EmergenciaRealizadaService);
        const voluntarioService = Container.get(VoluntarioService);
        const vehiculoService = Container.get(VehiculoService);
        const hospitalService = Container.get(HospitalService);
        const emergenciaPacienteService = Container.get(EmergenciaPacienteService);
        const pacienteService = Container.get(PacienteService);
        const emergenciaService = Container.get(EmergenciaService);
        const emergenciaSeccionalService = Container.get(EmergenciaSeccionalService);
        const vehiculoXemergenciaPacienteServicio = Container.get(VehiculoXEmergenciaPacienteService);

        const {
            identificadorFormulario,
            emergenciaId,
            voluntarioId,
            seccionalId,
            ubicacionExacta,
            fechaRealizada,
            fechaHoraLlamada,
            telefono,
            emisorEmergencia,
            comentario,
            ubicacionReferencia,
            latitud,
            longitud,
            pacienteVehiculoHospital
        }: {
            identificadorFormulario: string,
            emergenciaId: number,
            voluntarioId: Array<number>,
            seccionalId: Array<number>,
            ubicacionExacta: string,
            fechaRealizada: string,
            fechaHoraLlamada: string,
            telefono: string,
            emisorEmergencia: string,
            comentario: string,
            ubicacionReferencia: string,
            latitud: number,
            longitud: number,
            pacienteVehiculoHospital: Array<PacienteVehiculoHospital>
        } = req.body;

        //Getting seccional information
        const seccionales = await seccionalService.findByIds(seccionalId);
        if (!seccionales) {
            res.status(400).json({ message: 'Las seccionales que intenta asignar no existen' });
            return;
        }

        const emergencia = await emergenciaService.findById(emergenciaId);
        if (!emergencia) {
            res.status(400).json({ message: 'La emergencia que intenta asignar no existe' });
            return;
        }

        //Getting modality information
        const voluntarios = await voluntarioService.findByIds(voluntarioId);
        if (!voluntarios) {
            res.status(400).json({ message: 'Los voluntarios que intenta asignar no existen' });
            return;
        }

        //Setting person information
        const emergenciaRealizada = new EmergenciaRealizada();
        emergenciaRealizada.comentario = comentario;
        emergenciaRealizada.identificadorFormulario = identificadorFormulario;
        emergenciaRealizada.ubicacionExacta = ubicacionExacta;
        emergenciaRealizada.telefono = telefono;
        emergenciaRealizada.emisorEmergencia = emisorEmergencia;
        emergenciaRealizada.fechaRealizada = new Date(fechaRealizada);
        emergenciaRealizada.fechaHoraLlamada = new Date(fechaRealizada + 'T' + fechaHoraLlamada + ':00');
        emergenciaRealizada.emergencia = emergencia;
        emergenciaRealizada.ubicacionReferencia = ubicacionReferencia;
        emergenciaRealizada.latitud = latitud;
        emergenciaRealizada.longitud = longitud;

        const emergenciaRealizadaErrors = await validate(emergenciaRealizada);
        if (emergenciaRealizadaErrors.length > 0) {
            res.status(400).send(emergenciaRealizadaErrors);
            return;
        }

        let savedEmergenciaRealizada;

        try {
            savedEmergenciaRealizada = await emergenciaRealizadaService.create(emergenciaRealizada);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo crear la emergencia realizada 1' + error })
            return;
        }

        if (!savedEmergenciaRealizada) {
            res.status(400).json({ message: 'No se pudo crear la emergencia realizada 2' })
            return;
        }

        for (const seccional of seccionales) {
            const emergenciaSeccional = new EmergenciaSeccional();
            emergenciaSeccional.fechaInicio = new Date(fechaRealizada);
            emergenciaSeccional.seccional = seccional;
            emergenciaSeccional.emergenciaRealizada = savedEmergenciaRealizada;
            await emergenciaSeccionalService.create(emergenciaSeccional);
        }

        for (const voluntario of voluntarios) {
            let aux = voluntario.emergenciasRealizadas;
            if (aux) {
                aux.push(savedEmergenciaRealizada);
            }
            else {
                aux = [];
                aux.push(savedEmergenciaRealizada);
            }
            voluntario.emergenciasRealizadas = aux;
            await voluntarioService.update(voluntario);
        }

        let auxArrayVehiculosVaciosRegreso: PacienteVehiculoHospital[] = [];


        for (const pacienteVehiculoHospitalAux of pacienteVehiculoHospital) {
            if (!pacienteVehiculoHospitalAux.vacio) {
                const paciente = new Paciente();
                const persona = new Persona();

                persona.estadoPersona = true;
                (pacienteVehiculoHospitalAux.firstName > '') ? persona.firstName = pacienteVehiculoHospitalAux.firstName : "";
                (pacienteVehiculoHospitalAux.lastName > '') ? persona.lastName = pacienteVehiculoHospitalAux.lastName : "";
                (pacienteVehiculoHospitalAux.genero > '') ? persona.genero = pacienteVehiculoHospitalAux.genero : "";
                (pacienteVehiculoHospitalAux.documentoIdentificacion > '') ? persona.documentoIdentificacion = pacienteVehiculoHospitalAux.documentoIdentificacion : "";
                (pacienteVehiculoHospitalAux.tipoDocumentoPersona > '') ? persona.tipoDocumentoPersona = pacienteVehiculoHospitalAux.tipoDocumentoPersona : "";
                persona.estadoPersona = pacienteVehiculoHospitalAux.estadoPersona;
                paciente.menorEdad = pacienteVehiculoHospitalAux.menorEdad;
                (pacienteVehiculoHospitalAux.alergias > '') ? paciente.alergias = pacienteVehiculoHospitalAux.alergias : "";
                paciente.identificado = pacienteVehiculoHospitalAux.identificado;
                paciente.persona = persona;

                const personErrors = await validate(persona);

                if (personErrors.length > 0) {
                    res.status(400).send(personErrors);
                    return;
                }
                const emergenciaPaciente = new EmergenciaPaciente();
                emergenciaPaciente.paciente = paciente;
                pacienteVehiculoHospitalAux.tratamientosRealizados ? emergenciaPaciente.tratamientosRealizados = pacienteVehiculoHospitalAux.tratamientosRealizados : "";
                pacienteVehiculoHospitalAux.diagnostico ? emergenciaPaciente.diagnostico = pacienteVehiculoHospitalAux.diagnostico : "";
                pacienteVehiculoHospitalAux.prendaSuperior ? emergenciaPaciente.prendaSuperior = pacienteVehiculoHospitalAux.prendaSuperior : "";
                pacienteVehiculoHospitalAux.prendaInferior ? emergenciaPaciente.prendaInferior = pacienteVehiculoHospitalAux.prendaInferior : "";
                pacienteVehiculoHospitalAux.calzado ? emergenciaPaciente.calzado = pacienteVehiculoHospitalAux.calzado : "";
                pacienteVehiculoHospitalAux.estatura ? emergenciaPaciente.estatura = pacienteVehiculoHospitalAux.estatura : "";
                pacienteVehiculoHospitalAux.peloColorEstilo ? emergenciaPaciente.peloColorEstilo = pacienteVehiculoHospitalAux.peloColorEstilo : "";
                pacienteVehiculoHospitalAux.comentarioSenialEspecial ? emergenciaPaciente.comentarioSenialEspecial = pacienteVehiculoHospitalAux.comentarioSenialEspecial : "";

                const vehiculoXemergenciaPaciente = new VehiculoXEmergenciaPaciente();
                const voluntario = await voluntarioService.findById(pacienteVehiculoHospitalAux.voluntarioId);
                const vehiculo = await vehiculoService.findById(pacienteVehiculoHospitalAux.vehiculoId);
                const hospital = await hospitalService.findById(pacienteVehiculoHospitalAux.hospitalId);

                if (voluntario) {
                    vehiculoXemergenciaPaciente.voluntario = voluntario;
                }
                if (vehiculo) {
                    vehiculoXemergenciaPaciente.vehiculo = vehiculo;
                }
                if (hospital) {
                    vehiculoXemergenciaPaciente.hospital = hospital;
                }

                paciente.fechaCreacion = new Date(fechaRealizada);
                const savedPaciente = await pacienteService.create(paciente);

                emergenciaPaciente.paciente = savedPaciente;
                emergenciaPaciente.emergenciaRealizada = savedEmergenciaRealizada;
                vehiculoXemergenciaPaciente.horaSalida = new Date(pacienteVehiculoHospitalAux.fechaSalida + 'T' + pacienteVehiculoHospitalAux.horaSalida + ':00');
                vehiculoXemergenciaPaciente.horaRegreso = new Date(pacienteVehiculoHospitalAux.fechaRegreso + 'T' + pacienteVehiculoHospitalAux.horaRegreso + ':00');

                let auxArray: VehiculoXEmergenciaPaciente[] = [];
                auxArray.push(vehiculoXemergenciaPaciente);
                emergenciaPaciente.vehiculoXEmergenciaPaciente = auxArray;
                const savedEmergenciaPaciente = await emergenciaPacienteService.create(emergenciaPaciente);
                vehiculoXemergenciaPaciente.emergenciaPaciente = savedEmergenciaPaciente;
                const savedVehiculoXemergenciaPaciente = await vehiculoXemergenciaPacienteServicio.create(vehiculoXemergenciaPaciente);

                if (!savedVehiculoXemergenciaPaciente) {
                    res.status(400).json({ message: 'No se pudo crear la emergencia realizada 3' })
                    return;
                }
            }
            else {
                auxArrayVehiculosVaciosRegreso.push(pacienteVehiculoHospitalAux);

            }

        }


        const emergenciaPaciente = new EmergenciaPaciente();
        emergenciaPaciente.vehiculoXEmergenciaPaciente = [];
        emergenciaPaciente.emergenciaRealizada = savedEmergenciaRealizada;
        const savedEmergenciaPaciente = await emergenciaPacienteService.create(emergenciaPaciente);

        for (const pacienteVehiculoHospitalAux of auxArrayVehiculosVaciosRegreso) {
            const vehiculoXemergenciaPaciente = new VehiculoXEmergenciaPaciente();
            const voluntario = await voluntarioService.findById(pacienteVehiculoHospitalAux.voluntarioId);
            const vehiculo = await vehiculoService.findById(pacienteVehiculoHospitalAux.vehiculoId);
            const hospital = await hospitalService.findById(pacienteVehiculoHospitalAux.hospitalId);

            if (voluntario) {
                vehiculoXemergenciaPaciente.voluntario = voluntario;
            }
            if (vehiculo) {
                vehiculoXemergenciaPaciente.vehiculo = vehiculo;
            }
            if (hospital) {
                vehiculoXemergenciaPaciente.hospital = hospital;
            }
            vehiculoXemergenciaPaciente.emergenciaPaciente = savedEmergenciaPaciente;
            vehiculoXemergenciaPaciente.horaSalida = new Date(pacienteVehiculoHospitalAux.fechaSalida + 'T' + pacienteVehiculoHospitalAux.horaSalida + ':00');
            vehiculoXemergenciaPaciente.horaRegreso = new Date(pacienteVehiculoHospitalAux.fechaRegreso + 'T' + pacienteVehiculoHospitalAux.horaRegreso + ':00');

            const savedVehiculoXemergenciaPaciente = await vehiculoXemergenciaPacienteServicio.create(vehiculoXemergenciaPaciente);

            if (!savedVehiculoXemergenciaPaciente) {
                res.status(400).json({ message: 'No se pudo crear la emergencia realizada 4' })
                return;
            }
        }

        res.status(201).send('Emergencia realizada creada correctamente ');
    }

    static destroy = async (req: Request, res: Response) => {
        const emergenciaRealizadaService = Container.get(VoluntarioService);
        const id: string = String(req.params.id);

        try {
            await emergenciaRealizadaService.delete(id);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo eliminar la emergencia realizada ' })
            return;
        }
        res.status(204).send();
    }

    static update = async (req: Request, res: Response) => {
        const emergenciaRealizadaService = Container.get(EmergenciaRealizadaService);
        //const voluntarioService = Container.get(VoluntarioService);
        //const seccionalService = Container.get(SeccionalService);
        const emergenciaService = Container.get(EmergenciaService);
        const id: number = Number(req.params.id);
        const {
            identificadorFormulario,
            fechaRealizada,
            fechaHoraLlamada,
            emisorEmergencia,
            telefono,
            comentario,
            idEmergencia,
            latitud,
            longitud,
            ubicacionExacta,
            ubicacionReferencia,
            //voluntarioId,
            //seccionalId
        }: {
            identificadorFormulario: string,
            fechaRealizada: Date,
            fechaHoraLlamada: string,
            emisorEmergencia: string,
            telefono: string,
            comentario: string,
            idEmergencia: number,
            latitud: number,
            longitud: number,
            ubicacionExacta: string,
            ubicacionReferencia: string,
            //voluntarioId: Array<number>,
            //seccionalId: Array<number>     
        } = req.body;

        const emergencia = await emergenciaService.findById(idEmergencia);
        if (!emergencia) {
            res.status(400).json({ message: 'La emergencia que intenta asignar no existe' });
            return;
        }

        const emergenciaRealizada = await emergenciaRealizadaService.findById(id.toString());
        if (!emergenciaRealizada) {
            res.status(404).json({ message: 'Emergencia Realizada no encontrada ' });
            return;
        }

        emergenciaRealizada.identificadorFormulario = identificadorFormulario;
        emergenciaRealizada.fechaRealizada = new Date(fechaRealizada);
        emergenciaRealizada.fechaHoraLlamada = new Date(fechaRealizada + 'T' + fechaHoraLlamada + ':00');
        emergenciaRealizada.emisorEmergencia = emisorEmergencia;
        emergenciaRealizada.telefono = telefono;
        emergenciaRealizada.comentario = comentario;
        emergenciaRealizada.emergencia = emergencia;
        emergenciaRealizada.latitud = latitud;
        emergenciaRealizada.longitud = longitud;
        emergenciaRealizada.ubicacionExacta = ubicacionExacta;
        emergenciaRealizada.ubicacionReferencia = ubicacionReferencia;
        
        try {
            await emergenciaRealizadaService.update(emergenciaRealizada);
        } catch (e) {
            res.status(400).json({ message: 'No se pudo actualizar la Emergencia realizada' });
            return;
        }
        res.status(200).json({ message: 'Emergencia Realizada actualizada' });
    }
}

export default EmergenciaRealizadaController;