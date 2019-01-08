import {AbstractCheckboxSection, DISPLAY_MODE} from '../../../components/AbstractCheckboxSection';
import {
  APP_EVENT_HAUN_HAKUTAPA_SELECTION_CHANGE,
  APP_EVENT_HAUN_HAKUTAPA_SELECTION_CLEAR,
  APP_STATE_HAUN_HAKUTAPA_OPTIONS,
  APP_STATE_HAUN_HAKUTAPA_SELECTIONS
} from '../../../stores/haku/HaunHakutapaStore';

export class HaunHakutapaSection extends AbstractCheckboxSection {

  getClassName = () => 'HaunHakutapaSection';

  getHeader = () => 'Hakutapa';

  getCssClassName = () => 'checkbox-section haun-hakutapa-section';

  getOptionsStateName = () => APP_STATE_HAUN_HAKUTAPA_OPTIONS;

  getSelectionsStateName = () => APP_STATE_HAUN_HAKUTAPA_SELECTIONS;

  getSelectionChangeEventName = () => APP_EVENT_HAUN_HAKUTAPA_SELECTION_CHANGE;

  getSelectionClearEventName = () => APP_EVENT_HAUN_HAKUTAPA_SELECTION_CLEAR;

  getInstruction = () => 'Valitse hakutapa.';

  getDisplayMode = () => DISPLAY_MODE.RADIO_BUTTONS;

}
