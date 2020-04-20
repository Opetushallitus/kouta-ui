require('@cypress/snapshot').register();

Cypress.Commands.add('getByTestId', (testId, options = {}) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

Cypress.Commands.add(
  'paste',
  {
    prevSubject: true,
  },
  (subject, text, options = { force: true }) =>
    cy
      .get(subject)
      .click({ force: true })
      .invoke('val', text)
      .trigger('change', options),
);

Cypress.Commands.overwrite(
  'type',
  (originalFn, subject, text = '', options = {}) =>
    originalFn(subject, text, { force: true, delay: 0, ...options }),
);

// Workaround for broken cypress snapshot updates caused by this change:
// https://github.com/cypress-io/cypress/issues/2466
// TODO: Remove after @cypress/snapshot gets this fixed

Cypress.Commands.overwrite(
  'writeFile',
  (originalFn, filePath, contents, options) =>
    originalFn(filePath, contents, options).then(() => contents),
);
