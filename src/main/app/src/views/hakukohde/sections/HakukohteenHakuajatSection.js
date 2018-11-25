import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_HAKUKOHTEEN_HAKUAJAT} from '../../../stores/hakukohde/HakukohteenHakuajatStore';

export class HakukohteenHakuajatSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_HAKUAJAT]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenHakuajatSection';

  getHeader = () => 'Hakuajat';

}
