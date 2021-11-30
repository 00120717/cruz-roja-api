import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { UsuarioService } from '../services/UsuarioService';

export const checkRole = async (req: Request, res: Response, next: NextFunction) => {
  const code = res.locals.jwtPayload.userId;
  const voluntarioService = Container.get(UsuarioService);

  const student = await voluntarioService.findById(code);
  if (!student) {
    res.sendStatus(401);
    return;
  }
  next();
}
