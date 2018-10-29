import {
  APP_EVENT_HAKUKOHTEEN_KIELIVERSIO_SELECTION_CHANGE,
  APP_EVENT_HAKUKOHTEEN_KIELIVERSIO_SELECTION_CLEAR,
  APP_STATE_HAKUKOHTEEN_KIELIVERSIO_OPTIONS,
  APP_STATE_HAKUKOHTEEN_KIELIVERSIO_SELECTIONS
} from '../../../config/states';
import {AbstractCheckboxSection} from '../../../components/AbstractCheckboxSection';

export class HakukohteenKieliversioSection extends AbstractCheckboxSection {

  getClassName = () => 'HakukohteenKieliversioSection';

  getOptionsStateName = () => APP_STATE_HAKUKOHTEEN_KIELIVERSIO_OPTIONS;

  getSelectionsStateName = () => APP_STATE_HAKUKOHTEEN_KIELIVERSIO_SELECTIONS;

  getSelectionChangeEventName = () => APP_EVENT_HAKUKOHTEEN_KIELIVERSIO_SELECTION_CHANGE;

  getSelectionClearEventName = () => APP_EVENT_HAKUKOHTEEN_KIELIVERSIO_SELECTION_CLEAR;

  getHeader = () => 'Kieliversiot';

  getCssClassName = () => 'checkbox-section hakukohteen-kieliversio-section';

  getInstruction = () => 'Valitse ne kielet, joilla tiedot julkaistaan Opintopolussa';

}
