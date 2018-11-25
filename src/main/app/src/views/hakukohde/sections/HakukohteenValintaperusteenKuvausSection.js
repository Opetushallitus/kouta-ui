import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS} from '../../../stores/hakukohde/HakukohteenValintaperusteenKuvausStore';

export class HakukohteenValintaperusteenKuvausSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_VALINTAPERUSTEEN_KUVAUS]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenValintaperusteenKuvausSection';

  getHeader = () => 'Valintaperusteen kuvaus';

}
