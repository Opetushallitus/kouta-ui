import './commands';
import {
  stubLokalisaatioRoute,
  stubKayttoOikeusMeRoute,
  stubKoutaBackendLoginRoute,
} from '../utils';

require('cypress-plugin-retries');

beforeEach(() => {
  cy.server();

  stubLokalisaatioRoute({ cy });
  stubKayttoOikeusMeRoute({ cy });
  stubKoutaBackendLoginRoute({ cy });
});
