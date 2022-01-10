/* eslint-disable no-unused-vars */
export default interface IControllerRead {
  read(requestOrData, responseOrSocket): Promise<Response>;
  index(requestOrData, responseOrSocket): Promise<Response>;
  show(requestOrData, responseOrSocket): Promise<Response>;
}
