export default class MissingMethodError extends Error {
  name = 'MissingMethodError';
  message = 'There is a Flexible Persistence method call missing or a typo.';
}
