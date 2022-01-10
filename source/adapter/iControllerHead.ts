/* eslint-disable no-unused-vars */
export default interface IControllerHead {
  head(rrequestOrData, responseOrSocket): Promise<Response>;
}
