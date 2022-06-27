import AbstractControllerDefault from './abstractControllerDefault';
import { Operation } from 'flexiblepersistence';
import IControllerUpdate from '../adapter/iControllerUpdate';

export default abstract class AbstractControllerUpdate
  extends AbstractControllerDefault
  implements IControllerUpdate
{
  async update(args): Promise<Response> {
    return this.generateEvent(args, Operation.update, this.event.bind(this));
  }
  async replaceUpdate(args): Promise<Response> {
    return this.generateEvent(
      args,
      Operation.update,
      this.event.bind(this),
      undefined,
      true
    );
  }
}
