import {
  APP_EVENT_KIELIVERSIO_SELECTION_CHANGE,
  APP_EVENT_KIELIVERSIO_SELECTION_CLEAR,
  APP_STATE_KIELIVERSIO_OPTIONS,
  APP_STATE_KIELIVERSIO_SELECTIONS
} from '../../../config/states';
import {AbstractCheckboxSection} from '../../../components/AbstractCheckboxSection';

export class KoulutuksenKieliversioSection extends AbstractCheckboxSection {

  getOptionsStateName = () => APP_STATE_KIELIVERSIO_OPTIONS;

  getSelectionsStateName = () => APP_STATE_KIELIVERSIO_SELECTIONS;

  getSelectionChangeEventName = () => APP_EVENT_KIELIVERSIO_SELECTION_CHANGE;

  getSelectionClearEventName = () => APP_EVENT_KIELIVERSIO_SELECTION_CLEAR;

  getHeader = () => 'Kieliversiot';

  getCssClassName = () => 'checkbox-section koulutuksen-kieliversio-section';

  getClassName = () => 'KoulutuksenKieliversioSection';

  getInstruction = () => 'Valitse ne kielet, joilla tiedot julkaistaan Opintopolussa';

}
