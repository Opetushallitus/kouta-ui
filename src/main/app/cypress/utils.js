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

export const fillDateTimeInput = ({ date, time, cy }) => {
  getByTestId('DateTimeInput', cy).within(() => {
    getByTestId('DateTimeInput__Date', cy)
      .find('input')
      .type(date, { force: true });
    getByTestId('DateTimeInput__Time', cy)
      .find('input')
      .type(time, { force: true });
  });
};

export const chooseKieliversiotLanguages = (languages, cy) => {
  cy.get('input[name=sv]').uncheck({ force: true });
  cy.get('input[name=fi]').uncheck({ force: true });
  cy.get('input[name=en]').uncheck({ force: true });

  languages.forEach(language => {
    cy.get(`input[name=${language}]`).check({ force: true });
  });
};
