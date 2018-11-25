import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_VALINTAPERUSTEEN_SORA_KUVAUS} from '../../../stores/valintaperusteet/ValintaperusteenSoraKuvausStore';

export class ValintaperusteenSoraKuvausSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_VALINTAPERUSTEEN_SORA_KUVAUS]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'ValintaperusteenSoraKuvausSection';

  getHeader = () => 'Sora-kuvaus';

}
