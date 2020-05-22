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
    try {
      fireEvent.change(element[0], { target: { value } });
    } catch (e) {
      cy.get(element).then($destination => {
        const pasteEvent = Object.assign(
          new Event('paste', { bubbles: true, cancelable: true }),
          {
            clipboardData: {
              getData: (type = 'text') => value,
            },
          }
        );
        $destination[0].dispatchEvent(pasteEvent);
      });
    }
  }
);

Cypress.Commands.overwrite(
  'type',
  (originalFn, subject, text = '', options = {}) =>
    originalFn(subject, text, { force: true, delay: 0, ...options })
);

// Workaround for broken cypress snapshot updates caused by this change:
// https://github.com/cypress-io/cypress/issues/2466
// TODO: Remove after @cypress/snapshot gets this fixed

Cypress.Commands.overwrite(
  'writeFile',
  (originalFn, filePath, contents, options) =>
    originalFn(filePath, contents, options).then(() => contents)
);
