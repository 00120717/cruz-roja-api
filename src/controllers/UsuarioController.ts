import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { Usuario } from '../entities/Usuario';
import { Persona } from '../entities/Persona';
import { RolService } from '../services/RolService';
import { SedeService } from '../services/SedeService';
//import { SubjectService } from '../services/SubjectService';
import { UsuarioService } from '../services/UsuarioService';
import { Container } from "typedi";

export const UNIQUE_USER_EMAIL_CONSTRAINT = 'unique_user_email_constraint';

class UsuarioController {
  static fetch = async (req: Request, res: Response) => {
    const usuarioService = Container.get(UsuarioService);
    const users = await usuarioService.findAll();
    users.data = (users.data as Usuario[]).map((user) => {
      const { persona, ...rest } = user;
      return {
        ...rest,
        ...persona,
        id: rest.id,
      }
    })
    res.status(200).send(users);
  };

  static show = async (req: Request, res: Response) => {
    const usuarioService = Container.get(UsuarioService);
    //Get the ID from the url
    const id: number = Number(req.params.id);

    //Get the user from database
    const user = await usuarioService.findByIdWithRelations(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado ' });
      return;
    }
    const { persona, ...rest } = user;
    res.status(200).send({
      ...rest,
      ...persona,
      id: rest.id,
    });
  };

  static store = async (req: Request, res: Response) => {
    const usuarioService = Container.get(UsuarioService);
    const sedeService = Container.get(SedeService);
    const roleService = Container.get(RolService);
    
    const {
            documentoIdentificacion,
            tipoDocumentoPersona,
            fechaNacimiento,
            contrasenia,
            username,
            genero,
            firstName,
            lastName,
            email,
            estadoPersona,
            sedeId,
            rolId,
        }: {
            documentoIdentificacion: string,
            tipoDocumentoPersona: string,
            fechaNacimiento: string,
            contrasenia: string,
            username: string,
            genero: string,
            email: string,
            firstName: string,
            lastName: string,
            estadoPersona: boolean,
            sedeId: number,
            rolId: number,
        } = req.body;

    const role = await roleService.findById(rolId);
    if (!role) {
      res.status(400).json({ message: 'El rol que intenta asignar no existe' });
      return;
    }

    const sede = await sedeService.findById(sedeId);
    if (!sede) {
      res.status(400).json({ message: 'La sede que intenta asignar no existe' });
      return;
    }

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
      res.status(400).json({ message: 'No se pudo crear el usuario', error: personErrors });
      return;
    }

    const user = new Usuario();
    user.contrasenia = contrasenia;
    user.persona = persona;
    user.rol = role;

    //Validate if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).json({ message: 'No se pudo crear el usuario', error: errors });
      return;
    }

    await user.hashPassword();

    // Try to save.
    try {
      await usuarioService.create(user);
    } catch (error) {
      if (error?.constraint === UNIQUE_USER_EMAIL_CONSTRAINT) {
        res.status(400).json({ message: 'No se pudo crear el usuario', UNIQUE_USER_EMAIL_CONSTRAINT });
      }
      res.status(400).json({ message: 'No se pudo crear el usuario', error });
      return;
    }

    //If everything is ok, send 201 response
    res.status(201).json({ message: 'Usuario creado correctamente' });
  };

  static update = async (req: Request, res: Response) => {
    const usuarioService = Container.get(UsuarioService);
    const sedeService = Container.get(SedeService);
    const roleService = Container.get(RolService);
    const id = Number(req.params.id);

    const {
      documentoIdentificacion,
      tipoDocumentoPersona,
      fechaNacimiento,
      contrasenia,
      username,
      genero,
      firstName,
      lastName,
      email,
      estadoPersona,
      sedeId,
      rolId,
  }: {
      documentoIdentificacion: string,
      tipoDocumentoPersona: string,
      fechaNacimiento: string,
      contrasenia: string,
      username: string,
      genero: string,
      email: string,
      firstName: string,
      lastName: string,
      estadoPersona: boolean,
      sedeId: number,
      rolId: number,
  } = req.body;

    const user = await usuarioService.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado ' })
      return;
    }

    const role = await roleService.findById(rolId);
    if (!role) {
      res.status(400).json({ message: 'El rol que intenta asignar no existe' });
      return;
    }

    const sede = await sedeService.findById(sedeId);
    if (!sede) {
      res.status(400).json({ message: 'La sede que intenta asignar no existe' });
      return;
    }

    user.persona.username = username;
    user.persona.documentoIdentificacion = documentoIdentificacion;
    user.persona.tipoDocumentoPersona = tipoDocumentoPersona;
    user.persona.firstName = firstName;
    user.persona.lastName = lastName;
    user.persona.estadoPersona = estadoPersona;
    user.persona.genero = genero;
    user.persona.email = email;
    user.persona.fechaNacimiento = new Date(fechaNacimiento.substring(6,10)+'-'+fechaNacimiento.substring(3,5)+'-'+fechaNacimiento.substring(0,2));

    //Validate person entity
    const personErrors = await validate(user.persona);

    if (personErrors.length > 0) {
      res.status(400).send(personErrors);
      return;
    }

    if (contrasenia) {
      user.contrasenia = contrasenia;
    }
    user.rol = role;

    //Validate if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    if (contrasenia) {
      await user.hashPassword();
    }

    try {
      await usuarioService.update(user);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el usuario ' });
      return;
    }

    res.status(200).send('Usuario actualizado correctamente');
  };

  static destroy = async (req: Request, res: Response) => {
    const usuarioService = Container.get(UsuarioService);
    const id: number = Number(req.params.id);

    const user = await usuarioService.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado ' })
    }

    await usuarioService.delete(id);
    res.status(204).send();
  };
}

export default UsuarioController;
