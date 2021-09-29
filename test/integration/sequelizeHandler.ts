/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
// file deepcode ignore object-literal-shorthand: argh
import {
  Handler,
  MongoPersistence,
  PersistenceInfo,
} from 'flexiblepersistence';
import { DatabaseHandler } from '../../source/index';
import TestService from './testService';
import { eventInfo, readInfo } from './databaseInfos';
import { ServiceHandler } from '@flexiblepersistence/service';
import TestModel from './testModel';
import {
  SequelizePersistence,
  SequelizePersistenceInfo,
} from '@flexiblepersistence/sequelize';
import { Journaly, SenderReceiver } from 'journaly';

class PersistenceHandler extends DatabaseHandler {
  // async migrate(): Promise<boolean> {
  //   try {
  //     const events = await this.handler.readArray('events', {});
  //     await Utils.dropTables(this.getReadPool());
  //     await Utils.init(this.getReadPool());
  //     for (const event of events.receivedItem) {
  //       if (this.service[event.name] && this.operation[event.operation]) {
  //         const service = this.service[event.name];
  //         const operation = this.operation[event.operation];
  //         if (
  //           event.content &&
  //           event._id &&
  //           (!event.selection || (event.selection && !event.selection._id))
  //         ) {
  //           event.content.id = event._id.toString();
  //         }
  //         if (event.selection && event.selection._id && event.content) {
  //           await service[operation](event.selection._id, event.content);
  //         } else if (event.content) {
  //           await service[operation](event.content);
  //         } else if (event.selection && event.selection._id) {
  //           await service[operation](event.selection._id);
  //         }
  //       }
  //     }
  //     const all = await this.journaly.publish('TestService.selectAll')[0];
  //     if (!all || all.length < 1) {
  //       await this.journaly.publish('TestService.store', {});
  //     }
  //   } catch (error) {
  //     return new Promise((resolve, reject) => reject(error));
  //   }
  //   return new Promise((resolve) => resolve(true));
  // }
}

const journaly = Journaly.newJournaly() as SenderReceiver<any>;
const database = new SequelizePersistenceInfo(readInfo, journaly, {
  logging: false,
});
const eventdatabase = new PersistenceInfo(eventInfo, journaly);

const sequelize = new SequelizePersistence(database, { test: new TestModel() });

const read = new ServiceHandler(
  database,
  {
    test: new TestService(),
  },
  sequelize
);
const write = new MongoPersistence(eventdatabase);
// console.log(journaly.getSubjects());
const handler = new Handler(write, read);
export default PersistenceHandler.getInstance({
  handler: handler,
  journaly: journaly,
}) as PersistenceHandler;
