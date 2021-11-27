import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import {  VoluntarioService } from '../services/VoluntarioService';

export const checkStudentCode = async (req: Request, res: Response, next: NextFunction) => {
  const code = res.locals.jwtPayload.code;
  const voluntarioService = Container.get(VoluntarioService);

  const student = await voluntarioService.findByCode(code);
  if (!student) {
    res.sendStatus(401);
    return;
  }
  next();
}
