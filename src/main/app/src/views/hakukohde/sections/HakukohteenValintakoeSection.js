import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_HAKUKOHTEEN_VALINTAKOE} from '../../../stores/hakukohde/HakukohteenValintakoeStore';

export class HakukohteenValintakoeSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_VALINTAKOE]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenValintakoeSection';

  getHeader = () => 'Valintakoe';

}
