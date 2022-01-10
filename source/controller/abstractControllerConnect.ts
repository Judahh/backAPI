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
  async connect(requestOrData, responseOrSocket, server?): Promise<Response> {
    this.server = server;
    return this.generateEvent(
      requestOrData,
      responseOrSocket,
      Operation.other,
      this.event.bind(this)
    );
  }
}
