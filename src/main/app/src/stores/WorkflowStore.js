import {updateState} from '../utils/utils';
import {APP_STATE_WORKFLOW} from '../config/states';

export const WorkflowStore = () => {};

const WORKFLOW_TUTKINTOON_JOHTAVA_KOULUTUS = 'WORKFLOW_TUTKINTOON_JOHTAVA_KOULUTUS';

export const selectWorkflowTutkintoonJohtavaKoulutus = () => updateState(APP_STATE_WORKFLOW, {
  activeWorkFlow: WORKFLOW_TUTKINTOON_JOHTAVA_KOULUTUS
});

