import 'cypress-pipe';
import 'cypress-plugin-snapshots/commands';
import '@testing-library/cypress/add-commands';
import { configure } from '@testing-library/cypress';
configure({ testIdAttribute: 'data-testid' });

require('cypress-terminal-report/src/installLogsCollector')();
