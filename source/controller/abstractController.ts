/* eslint-disable @typescript-eslint/ban-ts-comment */
import IController from '../adapter/iController';
import { Mixin } from 'ts-mixer';
import AbstractControllerDelete from './abstractControllerDelete';
import AbstractControllerCreate from './abstractControllerCreate';
import AbstractControllerUpdate from './abstractControllerUpdate';
import AbstractControllerRead from './abstractControllerRead';
import AbstractControllerConnect from './abstractControllerConnect';
import AbstractControllerHead from './abstractControllerHead';
import AbstractControllerTrace from './abstractControllerTrace';

// @ts-ignore
export default abstract class AbstractController
  extends Mixin(
    AbstractControllerCreate,
    AbstractControllerRead,
    AbstractControllerUpdate,
    AbstractControllerDelete,
    AbstractControllerConnect,
    AbstractControllerHead,
    AbstractControllerTrace
  )
  implements IController {}
