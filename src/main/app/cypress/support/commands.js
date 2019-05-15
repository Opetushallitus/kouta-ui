require('@cypress/snapshot').register();

Cypress.Commands.add('getByTestId', (testId, options = {}) => {
  return cy.get(`[data-test-id="${testId}"]`, options);
});
