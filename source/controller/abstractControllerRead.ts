/* eslint-disable @typescript-eslint/ban-ts-comment */
import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerRead from '../adapter/iControllerRead';

export default abstract class AbstractControllerRead
  extends AbstractControllerDefault
  implements IControllerRead
{
  async read(requestOrData, responseOrSocket): Promise<Response> {
    if (
      Object.keys(requestOrData['query']).length !== 0 &&
      requestOrData['query'].id
    )
      return this.index(requestOrData, responseOrSocket);
    return this.show(requestOrData, responseOrSocket);
  }

  async index(requestOrData, responseOrSocket): Promise<Response> {
    return this.generateEvent(
      requestOrData,
      responseOrSocket,
      Operation.read,
      this.event.bind(this),
      true
    );
  }

  async show(requestOrData, responseOrSocket): Promise<Response> {
    return this.generateEvent(
      requestOrData,
      responseOrSocket,
      Operation.read,
      this.event.bind(this),
      false
    );
  }
}
