import './commands';
import { stubLokalisaatioRoute } from '../utils';

beforeEach(() => {
  cy.server();

  stubLokalisaatioRoute({ cy });
});
