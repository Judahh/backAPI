/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerConnect from '../adapter/iControllerConnect';

// @ts-ignore
export default abstract class AbstractControllerConnect
  extends AbstractControllerDefault
  implements IControllerConnect
{
  async connect(...args): Promise<Response> {
    return this.generateEvent(args, Operation.other, this.event.bind(this));
  }
}
