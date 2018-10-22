import {
  APP_EVENT_ORGANISAATIO_SELECTION_CHANGE,
  APP_EVENT_ORGANISAATIO_SELECTION_CLEAR,
  APP_STATE_ORGANISAATIO_OPTIONS,
  APP_STATE_ORGANISAATIO_SELECTIONS
} from '../../../config/states';
import {AbstractCheckboxSection} from '../../../components/AbstractCheckboxSection';

export class OrganisaatioSection extends AbstractCheckboxSection {

  getOptionsStateName = () => APP_STATE_ORGANISAATIO_OPTIONS;

  getSelectionsStateName = () => APP_STATE_ORGANISAATIO_SELECTIONS;

  getSelectionChangeEventName = () => APP_EVENT_ORGANISAATIO_SELECTION_CHANGE;

  getSelectionClearEventName = () => APP_EVENT_ORGANISAATIO_SELECTION_CLEAR;

  getClassName = () => 'OrganisaatioSection';

  getHeader = () => 'Valitse organisaatio';

  getInstruction = () => 'Valitse koulutuksen järjestävä organisaatio';

}
