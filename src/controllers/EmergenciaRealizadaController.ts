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
        res.status(200).send(emergenciasRealizadas);
    }

    static show = async (req: Request, res: Response) => {
        const emergenciaRealizadaService = Container.get(EmergenciaRealizadaService);
        const id: string = String(req.params.id);

        const emergenciaRealizada = await emergenciaRealizadaService.findByIdWithRelation(id);
        if (!emergenciaRealizada) {
            res.status(404).json({ message: 'Estudiante no encontrado ' });
            return;
        }

        res.status(200).send(emergenciaRealizada);
        
    }

    static store = async (req: Request, res: Response) => {
        const seccionalService = Container.get(SeccionalService);
        const emergenciaRealizadaService = Container.get(EmergenciaRealizadaService);
        const voluntarioService = Container.get(VoluntarioService);
        const vehiculoService =  Container.get(VehiculoService);
        const hospitalService =  Container.get(HospitalService);
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
        emergenciaRealizada.fechaRealizada = new Date(fechaRealizada.substring(6,10)+'-'+fechaRealizada.substring(3,5)+'-'+fechaRealizada.substring(0,2));
        emergenciaRealizada.fechaHoraLlamada = new Date(fechaRealizada.substring(6,10)+'-'+fechaRealizada.substring(3,5)+'-'+fechaRealizada.substring(0,2)+'T'+fechaHoraLlamada+':00');
        emergenciaRealizada.emergencia = emergencia;

        const emergenciaRealizadaErrors = await validate(emergenciaRealizada);
        if (emergenciaRealizadaErrors.length > 0) {
            res.status(400).send(emergenciaRealizadaErrors);
            return;
        }

        let savedEmergenciaRealizada;

        try {
            savedEmergenciaRealizada = await emergenciaRealizadaService.create(emergenciaRealizada);
        } catch (error) {
            res.status(400).json({ message: 'No se pudo crear la emergencia realizada 1'+ error })
            return;
        }

        if (!savedEmergenciaRealizada) {
            res.status(400).json({ message: 'No se pudo crear la emergencia realizada 2' })
            return;
        }

        for(const seccional of seccionales){
            const emergenciaSeccional = new EmergenciaSeccional();
            emergenciaSeccional.fechaInicio = new Date(fechaRealizada.substring(6,10)+'-'+fechaRealizada.substring(3,5)+'-'+fechaRealizada.substring(0,2));
            emergenciaSeccional.seccional = seccional;
            emergenciaSeccional.emergenciaRealizada = savedEmergenciaRealizada;
            await emergenciaSeccionalService.create(emergenciaSeccional);
        }

        for(const voluntario of voluntarios){
            let aux = voluntario.emergenciasRealizadas;
            if(aux){
                aux.push(savedEmergenciaRealizada);
            }
            else{
                aux = [];
                aux.push(savedEmergenciaRealizada);
            }
            voluntario.emergenciasRealizadas = aux;
            await voluntarioService.update(voluntario);
        }
        

        for(const pacienteVehiculoHospitalAux of pacienteVehiculoHospital){
            const paciente = new Paciente();
            const persona = new Persona();

            persona.estadoPersona = true;
            paciente.persona = persona;
    
            const personErrors = await validate(persona);
    
            if (personErrors.length > 0) {
                res.status(400).send(personErrors);
                return;
            }
            const emergenciaPaciente = new EmergenciaPaciente();
            emergenciaPaciente.paciente = paciente;

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

            paciente.fechaCreacion = new Date(fechaRealizada.substring(6,10)+'-'+fechaRealizada.substring(3,5)+'-'+fechaRealizada.substring(0,2));
            const savedPaciente = await pacienteService.create(paciente);

            emergenciaPaciente.paciente = savedPaciente;
            emergenciaPaciente.emergenciaRealizada = savedEmergenciaRealizada;
            vehiculoXemergenciaPaciente.horaSalida = new Date(fechaRealizada.substring(6,10)+'-'+fechaRealizada.substring(3,5)+'-'+fechaRealizada.substring(0,2)+'T'+pacienteVehiculoHospitalAux.horaSalida+':00');
            vehiculoXemergenciaPaciente.horaRegreso = new Date(fechaRealizada.substring(6,10)+'-'+fechaRealizada.substring(3,5)+'-'+fechaRealizada.substring(0,2)+'T'+pacienteVehiculoHospitalAux.horaRegreso+':00');

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
}

export default EmergenciaRealizadaController;