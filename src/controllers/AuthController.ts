import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import config from './../../config/config';
import { UsuarioService } from '../services/UsuarioService';
import { Container } from "typedi";
import { VoluntarioService } from '../services/VoluntarioService';

class AuthController {
  static login = async (req: Request, res: Response) => {
    const usuarioService = Container.get(UsuarioService);
    // Check if username and password are set
    let { username, password } = req.body;
    if (!(username && password)) {
      res.sendStatus(400);
    }

    // Get user form database

    const user = await usuarioService.findByUsernameWithRole(username);
    if (!user) {
      res.status(400).json({ message: 'Usuario incorrecto' });
      return
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).json({ message: 'La contraseña no es valida' });
      return;
    }

    //Sign JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.persona.username, role: user.rol.nombre },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    //Send the jwt in the response
    res.status(200).json({ token, type: 'Bearer' });
  };

  static signUp = async (req: Request, res: Response) => {

  }

  static loginVoluntario = async (req: Request, res: Response) => {
    const voluntarioService = Container.get(VoluntarioService);
    const { code }: { code: string } = req.body;
    if (!code) {
      res.status(400).json({ message: 'El código del voluntario es requerido' });
    }

    const voluntario = await voluntarioService.findByCode(code);
    if (!voluntario) {
      res.send(400).json({ message: 'El código del estudiante es incorrecto' });
      return;
    }

    const token = jwt.sign(
      { voluntarioId: voluntario.id, code: voluntario.voluntarioCodigoCarnet, isActive: voluntario.persona.estadoPersona },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, type: 'Bearer', voluntarioCodigoCarnet: voluntario.voluntarioCodigoCarnet });
  }
}

export default AuthController;
