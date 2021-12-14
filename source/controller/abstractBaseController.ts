/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// file deepcode ignore no-any: any needed
// file deepcode ignore object-literal-shorthand: argh
import { Default } from '@flexiblepersistence/default-initializer';
import { IService, IServiceSimple } from '@flexiblepersistence/service';
import { Handler, Event, Operation } from 'flexiblepersistence';
import IRouter from '../router/iRouter';
import MissingMethodError from '../error/missingMethodError';

export default abstract class AbstractBaseController extends Default {
  protected server;
  protected regularErrorStatus: {
    [error: string]: number;
  } = {
    error: 400,
    Error: 400,
    RemoveError: 400,
    RequestError: 400,
    MongoServerError: 400,
    JsonWebTokenError: 401,
    Unauthorized: 401,
    PaymentRequired: 402,
    TypeError: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    UnknownError: 500,
    MissingMethodError: 500,
  };
  protected method: {
    [method: string]: string;
  } = {
    GET: 'read',
    POST: 'store',
    PUT: 'forceUpdate',
    PATCH: 'update',
    DELETE: 'delete',
    OPTIONS: 'options',
    CONNECT: 'connect',
    HEAD: 'head',
    TRACE: 'trace',
  };
  // @ts-ignore
  protected handler: Handler | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected middlewares?: any[];
  async mainRequestHandler(
    requestOrData: Request | any,
    responseOrSocket: Response | any,
    operation: Operation
  ): Promise<Response> {
    try {
      let response;
      if (
        requestOrData.method &&
        this.method[requestOrData.method] &&
        this[this.method[requestOrData.method]]
      )
        response = await this[this.method[requestOrData.method]](
          requestOrData,
          responseOrSocket
        );
      else {
        const error = new Error('Missing HTTP method.');
        throw error;
      }
      return response;
    } catch (error) {
      console.error(error);
      return new Promise(() =>
        this.generateError(responseOrSocket, error, operation)
      );
    }
  }

  protected errorStatus(error?: string):
    | {
        [error: string]: number;
      }
    | number {
    if (error) return this.regularErrorStatus[error];
    return this.regularErrorStatus;
  }

  constructor(initDefault?: IRouter) {
    super(initDefault);
  }

  init(initDefault?: IRouter): void {
    super.init(initDefault);
    if (initDefault) {
      this.handler = initDefault.handler;
      this.middlewares = [];
      if (initDefault.middlewares)
        this.middlewares.push(...initDefault.middlewares);
    }
    // console.log(this.handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async event(event: Event): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!this.journaly) reject(new Error('No journaly connected!'));
      if (this.handler) {
        this.handler
          .addEvent(event)
          .then((value) => resolve(value))
          .catch((error) => reject(error));
      } else reject(new Error('No handler connected!'));
    });
  }

  protected runMiddleware(requestOrData, responseOrSocket, fn) {
    return new Promise((resolve, reject) => {
      fn(requestOrData, responseOrSocket, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  }

  protected async runMiddlewares(requestOrData, responseOrSocket) {
    if (this.middlewares)
      for (const middleware of this.middlewares)
        await this.runMiddleware(requestOrData, responseOrSocket, middleware);
  }

  protected generateName() {
    this.setName(this.getClassName().replace('Controller', this.getType()));
  }

  protected abstract emit(
    responseOrSocket,
    operation: Operation,
    status,
    object
  ): Promise<void>;

  protected async generateError(responseOrSocket, error, operation: Operation) {
    if (error === undefined) error = new MissingMethodError();
    if ((error.message as string).includes('does not exist'))
      error.name = 'NotFound';
    console.error(error);
    const message = error.message || error.name;
    const object = { ...error, message, operation };
    let status;
    if (!this.errorStatus() || this.errorStatus(error.name) === undefined) {
      status = this.errorStatus('UnknownError') as number;
    } else {
      status = this.errorStatus(error.name) as number;
    }
    await this.emit(responseOrSocket, operation, status, object);
    return responseOrSocket;
  }

  protected hasObjectName() {
    if (process.env.API_HAS_OBJECT_NAME)
      return /^true$/i.test(process.env.API_HAS_OBJECT_NAME);
    return false;
  }

  protected getObject(object) {
    if (this.hasObjectName()) return object[this.getName()];
    return object;
  }

  protected setObject(object, value) {
    if (value === undefined) value = {};
    if (this.hasObjectName()) {
      if (!this.getName()) throw new Error('Element is not specified.');
      object[this.getName()] = value;
    } else object = value;
    return object;
  }

  formatName() {
    const name = this.getClassName().replace('Controller', '');
    return name;
  }

  formatContent(requestOrData) {
    const content = requestOrData.body as IServiceSimple;
    return content;
  }

  formatParams(requestOrData) {
    return requestOrData['params'] || requestOrData.query;
  }

  formatQuery(requestOrData) {
    const { query } = requestOrData;
    return query;
  }

  formatSingle(params?, singleDefault?: boolean) {
    //  deepcode ignore HTTPSourceWithUncheckedType: params do not exist on next
    let single;
    if (params && params.single !== undefined && params.single !== null) {
      if (
        typeof params.single === 'string' ||
        params.single instanceof String
      ) {
        params.single =
          params.single.toLowerCase() === 'true' ||
          params.single.toLowerCase() === '1';
      } else {
        params.single = params.single === true || params.single === 1;
      }
      single = params.single as boolean;
    }
    if (singleDefault !== undefined && single === undefined)
      single = singleDefault;
    return single;
  }

  formatSelection(params?, query?) {
    let selection;
    // deepcode ignore HTTPSourceWithUncheckedType: <please specify a reason of ignoring this>, deepcode ignore HTTPSourceWithUncheckedType: <please specify a reason of ignoring this>
    if (params && params.filter) selection = params.filter;
    else selection = query as any;
    for (const key in selection) {
      if (Object.prototype.hasOwnProperty.call(selection, key)) {
        const element = selection[key];
        const newKey = key.split(/[\s,"'=;\-\/\\]+/)[0];
        selection[newKey] = element;
        if (key != newKey) {
          selection[key] = undefined;
          delete selection[key];
        }
      }
    }
    return selection;
  }

  formatEvent(requestOrData, operation: Operation, singleDefault?: boolean) {
    const params = this.formatParams(requestOrData);
    const name = this.formatName();
    if (requestOrData?.headers) {
      requestOrData.headers.pageSize =
        requestOrData.headers.pageSize || requestOrData.headers.pagesize;
      requestOrData.headers.numberOfPages =
        requestOrData.headers.numberOfPages ||
        requestOrData.headers.numberofpages;
    }
    const event = new Event({
      operation,
      single: this.formatSingle(
        requestOrData?.headers || params,
        singleDefault
      ),
      content: this.formatContent(requestOrData),
      selection: this.formatSelection(params, this.formatQuery(requestOrData)),
      name,
      options: requestOrData.headers,
    });
    requestOrData['event'] = {
      operation,
      name,
    };
    return event;
  }
  protected generateStatus(operation: Operation, object): number {
    const resultObject = this.getObject(object);
    switch (operation) {
      case Operation.create:
        return 201;
      case Operation.nonexistent:
        return 410;
      default:
        if (
          resultObject === undefined ||
          Object.keys(resultObject).length === 0 ||
          resultObject.length === 0
        )
          return 204;
        else return 200;
    }
    // 206 Partial Content - pagination
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected async generateObject(
    useFunction: (
      // eslint-disable-next-line no-unused-vars
      event: Event
    ) => Promise<IService[] | IService | number | boolean>,
    event: Event
  ) {
    return this.setObject({}, (await useFunction(event))['receivedItem']);
  }

  protected async generateHeaders(responseOrSocket, event) {
    if (responseOrSocket.setHeader) {
      const page = (event as any)?.options?.page;
      const pageSize = (event as any)?.options?.pageSize;
      const numberOfPages = (event as any)?.options?.numberOfPages;

      if (page) responseOrSocket.setHeader('page', page);
      if (pageSize) responseOrSocket.setHeader('pageSize', pageSize);
      if (numberOfPages)
        responseOrSocket.setHeader('numberOfPages', numberOfPages);
    }
  }
  protected async generateEvent(
    requestOrData,
    responseOrSocket,
    operation: Operation,
    useFunction: (
      // eslint-disable-next-line no-unused-vars
      event: Event
    ) => Promise<IService[] | IService | number | boolean>,
    singleDefault?: boolean
  ): Promise<Response | any> {
    try {
      const event = this.formatEvent(requestOrData, operation, singleDefault);
      await this.runMiddlewares(requestOrData, responseOrSocket);
      const object = await this.generateObject(useFunction, event);
      const status = this.generateStatus(operation, object);
      await this.generateHeaders(responseOrSocket, event);
      await this.emit(responseOrSocket, operation, status, object);
      return responseOrSocket;
    } catch (error) {
      console.error(error);
      return this.generateError(responseOrSocket, error, operation);
    }
  }
}
