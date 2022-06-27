/* eslint-disable no-unused-vars */
export default interface IControllerTrace {
  trace(...args): Promise<Response>;
}
