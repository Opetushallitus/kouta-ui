import './commands';
import { stubLokalisaatioRoute } from '../utils';

require('cypress-plugin-retries');

beforeEach(() => {
  cy.server();

  stubLokalisaatioRoute({ cy });
});
