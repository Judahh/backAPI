/* eslint-disable no-unused-vars */
export default interface IControllerConnect {
  connect(...args): Promise<Response>;
}
