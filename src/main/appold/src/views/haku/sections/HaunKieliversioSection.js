import {AbstractCheckboxSection} from '../../../components/AbstractCheckboxSection';
import {
  APP_EVENT_HAUN_KIELIVERSIO_SELECTION_CHANGE,
  APP_EVENT_HAUN_KIELIVERSIO_SELECTION_CLEAR,
  APP_STATE_HAUN_KIELIVERSIO_OPTIONS,
  APP_STATE_HAUN_KIELIVERSIO_SELECTIONS
} from '../../../stores/haku/HaunKieliversioStore';

export class HaunKieliversioSection extends AbstractCheckboxSection {

  getClassName = () => 'HaunKieliversioSection';

  getOptionsStateName = () => APP_STATE_HAUN_KIELIVERSIO_OPTIONS;

  getSelectionsStateName = () => APP_STATE_HAUN_KIELIVERSIO_SELECTIONS;

  getSelectionChangeEventName = () => APP_EVENT_HAUN_KIELIVERSIO_SELECTION_CHANGE;

  getSelectionClearEventName = () => APP_EVENT_HAUN_KIELIVERSIO_SELECTION_CLEAR;

  getHeader = () => 'Kieliversiot';

  getCssClassName = () => 'checkbox-section haun-kieliversio-section';

  getInstruction = () => 'Valitse ne kielet, joilla tiedot julkaistaan Opintopolussa';

}
