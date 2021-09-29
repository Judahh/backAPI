// file deepcode ignore no-any: any needed
import IDatabaseHandler from '../database/iDatabaseHandler';

export default interface IRouter extends IDatabaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middlewares?: any[];
}
