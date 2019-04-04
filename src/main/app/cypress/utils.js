import koodisto from './data/koodisto';

export const getByTestId = (testId, cy) => {
  return cy.get(`[data-test-id="${testId}"]`);
};

export const getRadio = (value, cy) => {
  return cy.get(`input[type="radio"][value="${value}"]`);
};

export const getSelectOption = (value, cy) => {
  return cy.get('[role="option"]').contains(value);
};

export const getCheckbox = (value, cy) => {
  return cy.get(`input[type="checkbox"][name="${value}"]`);
};

export const getSelect = cy => {
  return cy.get('.Select__');
};

export const selectOption = (value, cy) => {
  getSelect(cy).click();

  getSelectOption(value, cy).click();
};

export const stubKoodistoRoute = ({ koodisto: koodistonNimi, cy }) => {
  cy.route({
    method: 'GET',
    url: `**/koodisto-service/rest/json/${koodistonNimi}/koodi**`,
    response: koodisto({ koodisto: koodistonNimi }),
  });
};

export const stubLokalisaatioRoute = ({ cy }) => {
  cy.route({
    method: 'GET',
    url: '**/lokalisointi/cxf/rest/v1/localisation**',
    response: [],
  });
};

export const typeToEditor = (value, cy) => {
  cy.get('.Editor__').within(() => {
    cy.get('[contenteditable="true"]').type(value, { force: true });
  });
};

export const getTableInput = cy => {
  return cy.get('.TableInput__');
};
