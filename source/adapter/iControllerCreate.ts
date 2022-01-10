/* eslint-disable no-unused-vars */
export default interface IControllerCreate {
  create(requestOrData, responseOrSocket): Promise<Response>;
}
