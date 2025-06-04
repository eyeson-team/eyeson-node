// mock "form-data"

const mock = jest.fn().mockImplementation(() => ({
  append: jest.fn(),
  getHeaders: jest.fn(() => ({})),
  pipe: jest.fn(),
  submit: jest.fn(),
}));

module.exports = mock;
