/* eslint-disable @typescript-eslint/ban-ts-comment */
import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerCreate from '../adapter/iControllerCreate';

// @ts-ignore
export default class AbstractControllerCreate
  extends AbstractControllerDefault
  implements IControllerCreate
{
  // @ts-ignore
  async create(...args): Promise<Response> {
    return this.generateEvent(
      args,
      Operation.create,
      this.event.bind(this),
      true
    );
  }
}
