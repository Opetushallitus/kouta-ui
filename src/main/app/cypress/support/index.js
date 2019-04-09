import './commands';
import { stubLokalisaatioRoute, stubKayttoOikeusMeRoute } from '../utils';

require('cypress-plugin-retries');

beforeEach(() => {
  cy.server();

  stubLokalisaatioRoute({ cy });
  stubKayttoOikeusMeRoute({ cy });
});
