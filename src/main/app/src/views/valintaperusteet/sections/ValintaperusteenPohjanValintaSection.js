import {AbstractPohjanValintaSection} from '../../../components/AbstractPohjanValintaSection';
import {SCOPE_VALINTAPERUSTEEN_POHJA} from '../../../stores/valintaperusteet/ValintaperusteenPohjaStore';

export class ValintaperusteenPohjaSection extends AbstractPohjanValintaSection {

  getScope = () => SCOPE_VALINTAPERUSTEEN_POHJA;

  getCssClassName = () => 'pohjan-valinta-section valintaperusteen-pohjan-valinta-section';

  getClassName = () => 'ValintaperusteenPohjaSection';

  getHeader = () => 'Valitse pohja';

  getCreateEntityInfoText = () => 'Luodaan uusi valintaperuste.';

}
