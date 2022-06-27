/* eslint-disable no-unused-vars */
export default interface IControllerUpdate {
  update(...args): Promise<Response>;
  replaceUpdate(...args): Promise<Response>;
}
