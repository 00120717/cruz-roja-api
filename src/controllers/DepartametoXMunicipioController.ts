import { Request, Response } from 'express';
import { DepartamentoXMunicipioService } from '../services/DepartamentoXMunicipioService';
import { Container } from "typedi";

class DepartamentoXMunicipioController {
  static fetch = async (req: Request, res: Response) => {
    const roleService = Container.get(DepartamentoXMunicipioService);
    const roles = await roleService.findAll();
    res.status(200).send(roles);
  }

  static list = async (req: Request, res: Response) => {
    const roleService = Container.get(DepartamentoXMunicipioService);
    const roles = await roleService.listAll();
    let aux = roles.map(att =>{
      return {nombreCompuesto: (att.departamento.departamentoNombre+', '+att.municipio.municipioNombre), ...att };
    });
    res.status(200).send(aux);
  }

  /*static store = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermisoService);
    const roleService = Container.get(DepartamentoXMunicipioService);
    const {
      name,
      type,
      permissionId
    }: {
      name: string;
      type: string;
      permissionId: Array<number>
    } = req.body;

    //Getting permissionInformation
    const permissions = await permissionService.findByIds(permissionId);
    if (type === 'tutor' && (!permissions || permissions.length <= 0)) {
      res.status(400).json({ message: 'No se puede asignar un rol sin permisos' })
      return;
    }

    const role = new Rol();
    role.nombre = name;
    role.tipo = type;
    role.permisos = permissions;

    const roleErrors = await validate(role);
    if (roleErrors.length > 0) {
      res.status(400).send(roleErrors);
      return;
    }

    try {
      await roleService.create(role);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo crear el rol ' });
      return;
    }

    res.status(201).json({ message: 'Rol creado correctamente' });
  }

  static update = async (req: Request, res: Response) => {
    const permissionService = Container.get(PermisoService);
    const roleService = Container.get(RolService);
    const id = Number(req.params.id);

    const { name, type, permissionId }: { name: string, type: string, permissionId: Array<number> } = req.body;

    const role = await roleService.findByIdWithRelations(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' })
      return;
    }

    console.log('Role: ', role);
    console.log('Role Permission: ', role.permisos);

    const permissions = await permissionService.findByIds(permissionId);
    if (type === 'tutor' && (!permissions || permissions.length <= 0)) {
      res.status(400).json({ message: 'No se puede asiginar un rol sin permisos ' });
      return;
    }

    console.log('New permissions: ', permissions);

    role.nombre = name;
    role.tipo = type;
    role.permisos = permissions;

    const roleErrors = await validate(role);
    if (roleErrors.length > 0) {
      res.status(400).send(roleErrors);
      return;
    }

    try {
      await roleService.update(role);
    } catch (e) {
      res.status(400).json({ message: 'No se pudo actualizar el rol ' });
      return;
    }

    res.status(200).json({ message: 'Rol actualizado correctamente' });
  }*/

  static show = async (req: Request, res: Response) => {
    const roleService = Container.get(DepartamentoXMunicipioService);
    const id: number = Number(req.params.id);

    const role = await roleService.findByIdWithRelations(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado ' });
      return;
    }
    res.status(200).send(role);
  }

  static destroy = async (req: Request, res: Response) => {
    const roleService = Container.get(DepartamentoXMunicipioService);
    const id: number = Number(req.params.id);

    const role = await roleService.findById(id);
    if (!role) {
      res.status(404).json({ message: 'Rol no encontrado' })
    }

    await roleService.delete(id);
    res.status(204).send();
  }
}

export default DepartamentoXMunicipioController;
