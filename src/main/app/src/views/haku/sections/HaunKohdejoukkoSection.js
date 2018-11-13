import {APP_EVENT_ORGANISAATIO_SELECTION_CLEAR} from '../../../config/states';
import {
  APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CHANGE, APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CLEAR,
  APP_STATE_HAUN_KOHDEJOUKKO_OPTIONS,
  APP_STATE_HAUN_KOHDEJOUKKO_SELECTIONS
} from '../../../stores/haku/HaunKohdejoukkoStore';
import {AbstractCheckboxSection} from '../../../components/AbstractCheckboxSection';

export class HaunKohdejoukkoSection extends AbstractCheckboxSection {

  getClassName = () => 'HaunKohdejoukkoSection';

  getCssClassName = () => 'checkbox-section haun-kohdejoukko-section';

  getHeader = () => 'Haun kohdejoukko';

  getOptionsStateName = () => APP_STATE_HAUN_KOHDEJOUKKO_OPTIONS;

  getSelectionsStateName = () => APP_STATE_HAUN_KOHDEJOUKKO_SELECTIONS;

  getSelectionChangeEventName = () => APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CHANGE;

  getSelectionClearEventName = () => APP_EVENT_HAUN_KOHDEJOUKKO_SELECTION_CLEAR;

  getInstruction = () => 'Valitse haun kohdejoukko.';

}
