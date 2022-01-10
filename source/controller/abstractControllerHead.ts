import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerHead from '../adapter/iControllerHead';

export default abstract class AbstractControllerHead
  extends AbstractControllerDefault
  implements IControllerHead
{
  async head(requestOrData, responseOrSocket): Promise<Response> {
    return this.generateEvent(
      requestOrData,
      responseOrSocket,
      Operation.other,
      this.event.bind(this)
    );
  }
}
