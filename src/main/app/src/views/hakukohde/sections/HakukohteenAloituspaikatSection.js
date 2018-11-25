import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT} from '../../../stores/hakukohde/HakukohteenAloituspaikatStore';

export class HakukohteenAloituspaikatSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_ALOITUSPAIKAT]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenAloituspaikatSection';

  getHeader = () => 'Aloituspaikat';

}
