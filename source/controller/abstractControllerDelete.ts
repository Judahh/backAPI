/* eslint-disable @typescript-eslint/ban-ts-comment */
import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerDelete from '../adapter/iControllerDelete';
// @ts-ignore
export default class AbstractControllerDelete
  extends AbstractControllerDefault
  implements IControllerDelete
{
  async delete(...args): Promise<Response> {
    return this.generateEvent(args, Operation.delete, this.event.bind(this));
  }
}
