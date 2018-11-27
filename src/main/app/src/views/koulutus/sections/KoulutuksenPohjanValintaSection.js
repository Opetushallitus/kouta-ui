import {AbstractPohjanValintaSection} from '../../../components/AbstractPohjanValintaSection';
import {broadcast} from "../../../utils/stateUtils";
import {SCOPE_KOULUTUKSEN_POHJA} from '../../../stores/koulutus/KoulutuksenPohjaStore';

export class KoulutuksenPohjanValintaSection extends AbstractPohjanValintaSection {

  getScope = () => SCOPE_KOULUTUKSEN_POHJA;

  getCssClassName = () => 'pohjan-valinta-section koulutuksen-pohjan-valinta-section';

  getClassName = () => 'KoulutuksenPohjanValintaSection';

  getHeader = () => 'Luo koulutus';

  getCreateEntityInfoText = () => 'Luodaan uusi koulutus.';

  handleClearButtonClick = () => broadcast(SCOPE_KOULUTUKSEN_POHJA.STATE_MODE, undefined)

}
