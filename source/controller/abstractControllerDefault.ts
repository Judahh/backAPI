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
import { settings } from 'ts-mixer';
import RestArgs from './args/rest';
import SocketArgs from './args/socket';
import AllArgs from './args/all';
settings.initFunction = 'init';

export default abstract class AbstractControllerDefault extends Default {
  protected server;
  protected context;
  protected abstract restFramework;
  protected abstract socketFramework;
  protected abstract communication;
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
    POST: 'create',
    GET: 'read',
    PATCH: 'update',
    PUT: 'replaceUpdate',
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
  async mainRequestHandler(args, operation?: Operation): Promise<Response> {
    const { requestOrData, responseOrSocket, server } = this.parseArgs(args);
    try {
      let response;
      if (
        requestOrData.method &&
        this.method[requestOrData.method] &&
        this[this.method[requestOrData.method]]
      ) {
        response = await this[this.method[requestOrData.method]](args);
      } else {
        const error = new Error('Missing HTTP method.');
        throw error;
      }
      return response;
    } catch (error) {
      console.error(error);
      return new Promise(() =>
        this.generateError(
          requestOrData,
          responseOrSocket,
          {},
          error,
          operation
        )
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
    requestOrData?,
    responseOrSocket?,
    headers?,
    operation?: Operation,
    status?,
    object?
  ): Promise<void>;

  protected async generateError(
    requestOrData?,
    responseOrSocket?,
    headers?,
    error?,
    operation?: Operation
  ) {
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
    await this.emit(
      requestOrData,
      responseOrSocket,
      headers,
      operation,
      status,
      object
    );
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

  formatBoolean(name: string, headers?, defaultValue?: boolean): boolean {
    let content = headers ? headers[name] : undefined;
    if (content !== undefined) {
      content = typeof content === 'string' && content.toLowerCase();
      content =
        content === 'true' ||
        content === '1' ||
        content === 1 ||
        content === true;
    } else content = defaultValue;
    return content;
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
        try {
          selection[newKey] = JSON.parse(element);
        } catch (error) {
          selection[newKey] = element;
        }
        if (key != newKey) {
          selection[key] = undefined;
          delete selection[key];
        }
      }
    }
    return selection;
  }

  formatEvent(
    requestOrData,
    operation: Operation,
    singleDefault?: boolean,
    replace?: boolean
  ) {
    const params = this.formatParams(requestOrData);
    const name = this.formatName();
    if (requestOrData?.headers) {
      requestOrData.headers.pageSize =
        requestOrData.headers.pageSize || requestOrData.headers.pagesize;
    }
    const event = new Event({
      operation,
      single: this.formatBoolean(
        'single',
        requestOrData?.headers,
        singleDefault
      ),
      content: this.formatContent(requestOrData),
      selection: this.formatSelection(params, this.formatQuery(requestOrData)),
      name,
      options: requestOrData.headers,
      correct: this.formatBoolean('correct', requestOrData?.headers),
      replace: this.formatBoolean('replace', requestOrData?.headers) || replace,
    });
    requestOrData['event'] = {
      operation,
      name,
    };
    return event;
  }
  protected generateStatus(
    operation: Operation,
    object,
    correct?: boolean
  ): number {
    const resultObject = this.getObject(object);
    switch (operation) {
      case Operation.create:
        return 201;
      case Operation.delete:
        if (correct) return 410;
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

  protected async generateHeaders(requestOrData, responseOrSocket, event) {
    let headers = {};
    const page = (event as any)?.options?.page;
    const pageSize = (event as any)?.options?.pageSize;
    const pages = (event as any)?.options?.pages;
    if (responseOrSocket) {
      if (page)
        headers = {
          ...headers,
          ...this.setHeader(requestOrData, responseOrSocket, 'page', page),
        };
      if (pageSize)
        headers = {
          ...headers,
          ...this.setHeader(
            requestOrData,
            responseOrSocket,
            'pageSize',
            pageSize
          ),
        };
      if (pages)
        headers = {
          ...headers,
          ...this.setHeader(requestOrData, responseOrSocket, 'pages', pages),
        };
    }
    return headers;
  }

  protected async setHeader(
    requestOrData,
    responseOrSocket,
    name: string,
    value: string
  ) {
    if (responseOrSocket.setHeader) responseOrSocket.setHeader(name, value);
    if (requestOrData.setHeader) requestOrData.setHeader(name, value);
    const HeaderFragment = {};
    HeaderFragment[name] = value;
    return HeaderFragment;
  }

  protected async enableOptions(
    requestOrData,
    responseOrSocket,
    headers,
    operation: Operation
  ): Promise<boolean> {
    if (
      process.env.CORS_ENABLED?.toLocaleLowerCase() === 'true' ||
      process.env.ALLOWED_ORIGIN === '*'
    ) {
      console.log('CORS enabled');
      headers = {
        ...headers,
        ...this.setHeader(
          requestOrData,
          responseOrSocket,
          'Access-Control-Allow-Origin',
          '*'
        ),
      };
      headers = {
        ...headers,
        ...this.setHeader(
          requestOrData,
          responseOrSocket,
          'Access-Control-Allow-Credentials',
          'true'
        ),
      };
      headers = {
        ...headers,
        ...this.setHeader(
          requestOrData,
          responseOrSocket,
          'Access-Control-Allow-Methods',
          'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS,OTHER,*'
        ),
      };
      const exposedHeaders =
        'Access-Control-Allow-Headers, Origin, Accept, accept, authority, method, path, scheme, ' +
        'X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, ' +
        'Authorization, authorization, Access-Control-Allow-Origin, Cache-Control, If-Modified-Since, ' +
        'Sec-CH-UA-Arch, Sec-CH-UA-Bitness, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Full-Version, Sec-CH-UA-Mobile, ' +
        'Sec-CH-UA-Model, Sec-CH-UA-Platform-Version, Sec-CH-UA-PlatformSec-CH-UA, Sec-Fetch-Dest, Sec-Fetch-Mode, ' +
        'Sec-Fetch-Site, Sec-Fetch-User, Sec-WebSocket-Accept, Connection, Content-Disposition, Content-Encoding, ' +
        'If-None-Match, cache-control, if-modified-since, accept-encoding, accept-language, ' +
        'If-Match, if-match, If-Range, if-range, If-Unmodified-Since, if-unmodified-since, ' +
        'Accept-Encoding, Accept-Language, origin, referer, sec-ch-ua, sec-ch-ua-mobile, ' +
        'sec-ch-ua-platform, sec-fetch-dest, sec-fetch-mode, sec-fetch-site, user-agent, ' +
        'pages, page, pageSize, numberOfPages, pagesize, numberofpages, pageNumber, ' +
        'pagenumber, type, token, filter, single, sort, sortBy, sortByDesc, ' +
        'sortByDescending, sortByAsc, sortByAscending, sortByDescending, ' +
        'correct, replace, id, name, description, createdAt, updatedAt, *';
      headers = {
        ...headers,
        ...this.setHeader(
          requestOrData,
          responseOrSocket,
          'Access-Control-Allow-Headers',
          process.env.ALLOWED_HEADERS
            ? process.env.ALLOWED_HEADERS
            : exposedHeaders
        ),
      };
      headers = {
        ...headers,
        ...this.setHeader(
          requestOrData,
          responseOrSocket,
          'Access-Control-Expose-Headers',
          process.env.ALLOWED_HEADERS
            ? process.env.ALLOWED_HEADERS
            : exposedHeaders
        ),
      };

      if (
        requestOrData.method?.toLowerCase() === 'options' ||
        requestOrData.method?.toLowerCase() === 'option'
      ) {
        await this.emit(
          requestOrData,
          responseOrSocket,
          headers,
          operation,
          200,
          {}
        );
        return true;
      }
    }
    return false;
  }

  protected getHandshakeHeaders(requestOrData, responseOrSocket) {
    if (responseOrSocket?.handshake?.headers) {
      const setHeader = (key, value) => {
        responseOrSocket.handshake.headers[key] = value;
      };
      const removeHeader = (key) => {
        delete responseOrSocket.handshake.headers[key];
      };
      responseOrSocket.headers = responseOrSocket.handshake.headers;
      requestOrData.headers = responseOrSocket.handshake.headers;
      responseOrSocket.query = responseOrSocket.handshake.query;
      requestOrData.query = responseOrSocket.handshake.query;
      responseOrSocket.auth = responseOrSocket.handshake.auth;
      requestOrData.auth = responseOrSocket.handshake.auth;
      responseOrSocket.setHeader = setHeader;
      responseOrSocket.removeHeader = removeHeader;
      requestOrData.setHeader = setHeader;
      requestOrData.removeHeader = removeHeader;
    }
  }

  protected parseExpressArgs(args): RestArgs {
    return {
      request: args[0],
      response: args[1],
    };
  }

  protected parseNextArgs(args): RestArgs {
    return {
      request: args[0],
      response: args[1],
    };
  }

  protected parseAWSArgs(args): RestArgs {
    args[0].method = args[0].httpMethod;
    args[0].params = args[0].queryStringParameters;
    return {
      request: args[0],
      context: args[1],
    };
  }

  protected parseRestArgs(args): RestArgs {
    switch (this.restFramework) {
      case 'express':
        return this.parseExpressArgs(args);

      case 'next':
        return this.parseNextArgs(args);

      case 'aws':
        return this.parseAWSArgs(args);

      default:
        return this.parseNextArgs(args);
    }
  }

  protected parseWebArgs(args): SocketArgs {
    return {
      data: args[0],
      socket: args[1],
      server: args[2],
    };
  }

  protected parseIoArgs(args): SocketArgs {
    return {
      data: args[0],
      socket: args[1],
      server: args[2],
    };
  }

  protected parseSocketArgs(args): SocketArgs {
    switch (this.socketFramework) {
      case 'web':
        return this.parseWebArgs(args);

      case 'io':
        return this.parseIoArgs(args);

      default:
        return this.parseIoArgs(args);
    }
  }

  protected parseArgs(args): AllArgs {
    let newArgs;
    switch (this.communication) {
      case 'rest':
        newArgs = this.parseRestArgs(args);
        break;

      case 'socket':
        newArgs = this.parseSocketArgs(args);
        break;

      default:
        newArgs = this.parseRestArgs(args);
        break;
    }
    return {
      requestOrData: newArgs.request || newArgs.data,
      responseOrSocket: newArgs.response || newArgs.socket,
      server: newArgs.server,
      context: newArgs.context,
    };
  }

  protected async generateEvent(
    args,
    operation: Operation,
    useFunction: (
      // eslint-disable-next-line no-unused-vars
      event: Event
    ) => Promise<IService[] | IService | number | boolean>,
    singleDefault?: boolean,
    replace?: boolean
  ): Promise<Response | any> {
    const { requestOrData, responseOrSocket, context, server } =
      this.parseArgs(args);
    let headers: any = {};
    try {
      if (server) this.server = server;
      if (context) this.context = context;
      this.getHandshakeHeaders(requestOrData, responseOrSocket);
      if (
        await this.enableOptions(
          requestOrData,
          responseOrSocket,
          headers,
          operation
        )
      ) {
        return responseOrSocket;
      }
      const event = this.formatEvent(
        requestOrData,
        operation,
        singleDefault,
        replace
      );
      await this.runMiddlewares(requestOrData, responseOrSocket);
      const object = await this.generateObject(useFunction, event);
      const status = this.generateStatus(operation, object);
      headers = {
        ...headers,
        ...(await this.generateHeaders(requestOrData, responseOrSocket, event)),
      };
      await this.emit(
        requestOrData,
        responseOrSocket,
        headers,
        operation,
        status,
        object
      );
      return responseOrSocket;
    } catch (error) {
      console.error(error);
      return this.generateError(
        requestOrData,
        responseOrSocket,
        headers,
        error,
        operation
      );
    }
  }

  async options(args): Promise<Response> {
    return this.generateEvent(args, Operation.other, this.event.bind(this));
  }
}
