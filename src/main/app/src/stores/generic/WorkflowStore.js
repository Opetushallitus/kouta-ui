import {updateState} from '../../utils/stateUtils';
import {APP_STATE_WORKFLOW} from '../../config/states';
import {WORKFLOW} from '../../config/constants';

export const WorkflowStore = () => {};

export const selectWorkflowKoulutus = () => updateState(APP_STATE_WORKFLOW, {
  activeWorkFlow: WORKFLOW.KOULUTUS
});

export const selectWorkflow = (url) => updateState(APP_STATE_WORKFLOW, {
  activeWorkFlow: {
    '/koulutus': WORKFLOW.KOULUTUS,
    '/toteutus': WORKFLOW.TOTEUTUS,
    '/haku': WORKFLOW.HAKU,
    '/hakukohde': WORKFLOW.HAKUKOHDE,
    '/valintaperusteet': WORKFLOW.VALINTAPERUSTEET
  }[url]
});

