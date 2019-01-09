import {initState, updateState} from '../../utils/stateUtils';
import {WORKFLOW} from '../../config/constants';

export const APP_STATE_WORKFLOW = 'APP_STATE_WORKFLOW';

export const WorkflowStore = () => initState(APP_STATE_WORKFLOW, WORKFLOW.KOULUTUS);

export const selectWorkflowKoulutus = () => updateState(APP_STATE_WORKFLOW, {
  activeWorkFlow: WORKFLOW.KOULUTUS
});

export const selectWorkflow = (url) => updateState(APP_STATE_WORKFLOW, {
    '/koulutus': WORKFLOW.KOULUTUS,
    '/toteutus': WORKFLOW.TOTEUTUS,
    '/haku': WORKFLOW.HAKU,
    '/hakukohde': WORKFLOW.HAKUKOHDE,
    '/valintaperusteet': WORKFLOW.VALINTAPERUSTEET
  }[url]
);
