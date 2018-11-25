import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_VALINTAPERUSTEEN_VALINTATAPA} from '../../../stores/valintaperusteet/ValintaperusteenValintatapaStore';

export class ValintaperusteenValintatapaSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_VALINTAPERUSTEEN_VALINTATAPA]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'ValintaperusteenValintatapaSection';

  getHeader = () => 'Valintatapa';

}
