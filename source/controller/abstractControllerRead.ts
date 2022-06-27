/* eslint-disable @typescript-eslint/ban-ts-comment */
import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerRead from '../adapter/iControllerRead';

export default abstract class AbstractControllerRead
  extends AbstractControllerDefault
  implements IControllerRead
{
  async read(...args): Promise<Response> {
    const { requestOrData } = this.parseArgs(args);
    if (
      Object.keys(requestOrData['query']).length !== 0 &&
      requestOrData['query'].id
    )
      return this.index(...args);
    return this.show(...args);
  }

  async index(...args): Promise<Response> {
    return this.generateEvent(
      args,
      Operation.read,
      this.event.bind(this),
      true
    );
  }

  async show(...args): Promise<Response> {
    return this.generateEvent(
      args,
      Operation.read,
      this.event.bind(this),
      false
    );
  }
}
