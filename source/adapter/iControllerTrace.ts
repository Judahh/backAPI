/* eslint-disable no-unused-vars */
export default interface IControllerTrace {
  trace(rrequestOrData, responseOrSocket): Promise<Response>;
}
