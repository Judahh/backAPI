/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
// file deepcode ignore object-literal-shorthand: argh
import { BaseServiceDefault } from '@flexiblepersistence/service';
export default class BasicService extends BaseServiceDefault {
  generateType(): void {
    this.setType('DAO');
  }
}
