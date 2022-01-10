import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerUpdate from '../adapter/iControllerUpdate';

export default abstract class AbstractControllerUpdate
  extends AbstractControllerDefault
  implements IControllerUpdate
{
  async update(requestOrData, responseOrSocket): Promise<Response> {
    return this.generateEvent(
      requestOrData,
      responseOrSocket,
      Operation.update,
      this.event.bind(this)
    );
  }
  async replaceUpdate(requestOrData, responseOrSocket): Promise<Response> {
    return this.generateEvent(
      requestOrData,
      responseOrSocket,
      Operation.update,
      this.event.bind(this),
      undefined,
      true
    );
  }
}
