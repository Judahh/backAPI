import IControllerConnect from './iControllerConnect';
import IControllerDelete from './iControllerDelete';
import IControllerHead from './iControllerHead';
import IControllerRead from './iControllerRead';
import IControllerCreate from './iControllerCreate';
import IControllerTrace from './iControllerTrace';
import IControllerUpdate from './iControllerUpdate';

export default interface IController
  extends IControllerCreate,
    IControllerRead,
    IControllerUpdate,
    IControllerDelete,
    IControllerConnect,
    IControllerHead,
    IControllerTrace {}
