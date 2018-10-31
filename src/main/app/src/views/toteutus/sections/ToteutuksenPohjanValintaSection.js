import {AbstractPohjanValintaSection} from '../../../components/AbstractPohjanValintaSection';
import {SCOPE_TOTEUTUKSEN_POHJA} from '../../../config/scopes/PohjanValinta';

export class ToteutuksenPohjanValintaSection extends AbstractPohjanValintaSection {

  getScope = () => SCOPE_TOTEUTUKSEN_POHJA;

  getCssClassName = () => 'pohjan-valinta-section toteutuksen-pohjan-valinta-section';

  getClassName = () => 'ToteutuksenPohjanValintaSection';

  getHeader = () => 'Pohjan valinta';

  getCreateEntityInfoText = () => 'Luodaan uusi toteutus.';

}
