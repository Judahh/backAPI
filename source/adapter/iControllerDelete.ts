/* eslint-disable no-unused-vars */
export default interface IControllerDelete {
  delete(requestOrData, responseOrSocket): Promise<Response>;
}
