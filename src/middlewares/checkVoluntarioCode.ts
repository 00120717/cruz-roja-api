import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import {  VoluntarioService } from '../services/VoluntarioService';

export const checkVoluntarioCode = async (req: Request, res: Response, next: NextFunction) => {
  const code = res.locals.jwtPayload.code;
  const voluntarioService = Container.get(VoluntarioService);

  const voluntario = await voluntarioService.findByCode(code);
  if (!voluntario) {
    res.sendStatus(401);
    return;
  }
  next();
}
