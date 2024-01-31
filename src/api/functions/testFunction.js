/* eslint-disable no-undef */
const handler = () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
  };
};

module.exports = {
  handler,
};
