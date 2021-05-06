/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Handler, PersistenceAdapter } from 'flexiblepersistence';
import { SenderReceiver } from 'journaly';
import DatabaseHandlerInitializer from './databaseHandlerInitializer';
// @ts-ignore
export default abstract class DatabaseHandler {
  // @ts-ignore
  protected init?: DatabaseHandlerInitializer;

  getJournaly(): SenderReceiver<any> {
    if (this.init && this.init.journaly) return this.init.journaly;
    throw new Error('DatabaseHandler must have a init and a handler.');
  }

  getHandler(): Handler {
    if (this.init && this.init.handler) return this.init.handler;
    throw new Error('DatabaseHandler must have a init and a handler.');
  }

  protected static _instance: DatabaseHandler;

  protected constructor(init?: DatabaseHandlerInitializer) {
    this.init = init;
  }

  getInit(): DatabaseHandlerInitializer {
    if (this.init) return this.init;
    throw new Error('DatabaseHandler must have a init.');
  }

  getReadHandler(): PersistenceAdapter {
    const handler = this.getHandler();
    if (handler) {
      const write = handler.getWrite();
      if (write) {
        const read = write.getRead();
        if (read) if (read.getReadDB()) return read.getReadDB();
      }
    }
    throw new Error('DatabaseHandler must have a ReadDB.');
  }

  static getInstance(init?: DatabaseHandlerInitializer): DatabaseHandler {
    if (!this._instance) {
      // @ts-ignore
      this._instance = new this(init);
    }
    return this._instance;
  }
}
