import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerHead from '../adapter/iControllerHead';

export default abstract class AbstractControllerHead
  extends AbstractControllerDefault
  implements IControllerHead
{
  async head(args): Promise<Response> {
    return this.generateEvent(args, Operation.other, this.event.bind(this));
  }
}
