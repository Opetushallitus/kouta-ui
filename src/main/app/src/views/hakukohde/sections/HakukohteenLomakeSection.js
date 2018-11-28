import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_HAKUKOHTEEN_LOMAKE} from '../../../stores/hakukohde/HakukohteenLomakeStore';

export class HakukohteenLomakeSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_LOMAKE]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenLomakeSection';

  getHeader = () => 'Lomake';

}
