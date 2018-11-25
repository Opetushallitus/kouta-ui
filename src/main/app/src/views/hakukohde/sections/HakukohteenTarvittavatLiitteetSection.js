import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET} from '../../../stores/hakukohde/HakukohteenTarvittavatLiitteetStore';

export class HakukohteenTarvittavatLiitteetSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_TARVITTAVAT_LIITTEET]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenTarvittavatLiitteetSection';

  getHeader = () => 'Tarvittavat liitteet';

}
