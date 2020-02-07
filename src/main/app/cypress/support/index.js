import './commands';
import {
  stubLokalisaatioRoute,
  stubKayttoOikeusMeRoute,
  stubKoutaBackendLoginRoute,
  stubKoutaBackendSessionRoute,
} from '../utils';

require('cypress-plugin-retries');

beforeEach(() => {
  cy.server();
  stubLokalisaatioRoute({ cy });
  stubKayttoOikeusMeRoute({ cy });
  stubKoutaBackendLoginRoute({ cy });
  stubKoutaBackendSessionRoute({ cy });
});
