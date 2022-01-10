/* eslint-disable no-unused-vars */
export default interface IControllerUpdate {
  update(requestOrData, responseOrSocket): Promise<Response>;
  replaceUpdate(requestOrData, responseOrSocket): Promise<Response>;
}
