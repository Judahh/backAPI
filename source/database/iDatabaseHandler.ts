// file deepcode ignore no-any: any needed
import { IDefault } from '@flexiblepersistence/default-initializer';
import { Handler } from 'flexiblepersistence';

export default interface IDatabaseHandler extends IDefault {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler?: Handler;
}
