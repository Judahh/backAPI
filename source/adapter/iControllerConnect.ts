/* eslint-disable no-unused-vars */
export default interface IControllerConnect {
  connect(requestOrData, responseOrSocket, server?): Promise<Response>;
}
