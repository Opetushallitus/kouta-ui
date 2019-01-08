import {AbstractPohjanValintaSection} from '../../../components/AbstractPohjanValintaSection';
import {SCOPE_HAUN_POHJA} from '../../../stores/haku/HaunPohjaStore';

export class HaunPohjanValintaSection extends AbstractPohjanValintaSection {

  getScope = () => SCOPE_HAUN_POHJA;

  getCssClassName = () => 'pohjan-valinta-section haun-pohjan-valinta-section';

  getClassName = () => 'HaunPohjanValintaSection';

  getHeader = () => 'Pohjan valinta';

  getCreateEntityInfoText = () => 'Luodaan uusi haku.';

}
