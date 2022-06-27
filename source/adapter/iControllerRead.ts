/* eslint-disable no-unused-vars */
export default interface IControllerRead {
  read(...args): Promise<Response>;
  index(...args): Promise<Response>;
  show(...args): Promise<Response>;
}
