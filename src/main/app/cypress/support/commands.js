require('@cypress/snapshot').register();

Cypress.Commands.add('getByTestId', (testId, options = {}) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

// Workaround for broken cypress snapshot updates caused by this change:
// https://github.com/cypress-io/cypress/issues/2466
// TODO: Remove after @cypress/snapshot gets this fixed

Cypress.Commands.overwrite(
  'writeFile',
  (originalFn, filePath, contents, options) =>
    originalFn(filePath, contents, options).then(() => contents),
);
