const path = require('path');

const MOCK_PATH = 'cypress/mocks';

export const addMockFileRoutes = fileName => {
  cy.readFile(path.join(MOCK_PATH, fileName)).then(data => {
    data.forEach(({ url, method = 'GET', response }) => {
      // TODO: Mock only on matching response body and use cy.intercept()
      cy.route({
        method,
        url,
        status: response.status,
        response: response.body,
      });
    });
  });
};
