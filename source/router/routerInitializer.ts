// file deepcode ignore no-any: any needed
import DatabaseHandlerInitializer from '../database/databaseHandlerInitializer';

export default interface RouterInitializer extends DatabaseHandlerInitializer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middlewares?: any[];
}
