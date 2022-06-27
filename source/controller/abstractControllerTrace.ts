import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerTrace from '../adapter/iControllerTrace';

export default abstract class AbstractControllerTrace
  extends AbstractControllerDefault
  implements IControllerTrace
{
  async trace(args): Promise<Response> {
    return this.generateEvent(args, Operation.other, this.event.bind(this));
  }
}
