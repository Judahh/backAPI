// file deepcode ignore no-any: any needed
import { DefaultInitializer } from '@flexiblepersistence/default-initializer';
import { Handler } from 'flexiblepersistence';

export default interface DatabaseHandlerInitializer extends DefaultInitializer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler?: Handler;
}
