import { Mixin } from 'ts-mixer';

import DatabaseHandler from './database/databaseHandler';
import IDatabaseHandler from './database/iDatabaseHandler';
import IRouter from './router/iRouter';

export { DatabaseHandler, Mixin };
export type { IRouter, IDatabaseHandler };
