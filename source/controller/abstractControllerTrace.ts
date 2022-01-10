import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerTrace from '../adapter/iControllerTrace';

export default abstract class AbstractControllerTrace
  extends AbstractControllerDefault
  implements IControllerTrace
{
  async trace(requestOrData, responseOrSocket): Promise<Response> {
    return this.generateEvent(
      requestOrData,
      responseOrSocket,
      Operation.other,
      this.event.bind(this)
    );
  }
}
