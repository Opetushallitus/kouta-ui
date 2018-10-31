import {
  APP_EVENT_KOULUTUKSEN_POHJA_ENTRY,
  APP_EVENT_KOULUTUKSEN_POHJA_MODE,
  APP_STATE_KOULUTUKSEN_POHJA_ENTRY,
  APP_STATE_KOULUTUKSEN_POHJA_ENTRY_OPTIONS,
  APP_STATE_KOULUTUKSEN_POHJA_MODE,
  APP_STATE_KOULUTUKSEN_POHJA_MODE_OPTIONS
} from '../../../config/states';
import {AbstractPohjanValintaSection} from '../../../components/AbstractPohjanValintaSection';

export class KoulutuksenPohjanValintaSection extends AbstractPohjanValintaSection {

  getCssClassName = () => 'pohjan-valinta-section koulutuksen-pohjan-valinta-section';

  getClassName = () => 'KoulutuksenPohjanValintaSection';

  getHeader = () => 'Luo koulutus';

  getCreateEntityInfoText = () => 'Luodaan uusi koulutus.';

  getStateNameForEntryOptions = () => APP_STATE_KOULUTUKSEN_POHJA_ENTRY_OPTIONS;

  getStateNameForMode = () => APP_STATE_KOULUTUKSEN_POHJA_MODE;

  getStateNameForModeOptions = () => APP_STATE_KOULUTUKSEN_POHJA_MODE_OPTIONS;

  getStateNameForEntry = () => APP_STATE_KOULUTUKSEN_POHJA_ENTRY;

  getEventNameForEntry = () => APP_EVENT_KOULUTUKSEN_POHJA_ENTRY;

  getEventNameForMode = () => APP_EVENT_KOULUTUKSEN_POHJA_MODE;

}
