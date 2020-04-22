import { fireEvent } from '@testing-library/react';

require('@cypress/snapshot').register();

Cypress.Commands.add('getByTestId', (testId, options = {}) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

Cypress.Commands.add(
  'paste',
  {
    prevSubject: true,
  },
  (element, value) => {
    element.focus();
    fireEvent.change(element[0], { target: { value } });
  },
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
