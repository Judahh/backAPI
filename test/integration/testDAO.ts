import { BaseDAO, IBaseDAODefault } from '@flexiblepersistence/dao';
/* eslint-disable no-unused-vars */
export default class TestDAO extends BaseDAO {
  generateName(): void {
    this.setName('tests');
  }

  protected values = '*';

  protected insert = 'id';

  protected insertValues = '$1';

  protected updateQuery = '';

  constructor(initDefault?: IBaseDAODefault) {
    super(initDefault);
  }
}
