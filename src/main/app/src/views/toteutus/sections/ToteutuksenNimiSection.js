import {AbstractSection} from '../../../components/AbstractSection';
import {connectListener} from '../../../utils/stateUtils';
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SELECTIONS} from '../../../config/states';

export class ToteutuksenNimiSection extends AbstractSection {

  onMount = () => connectListener(this, APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SELECTIONS, (incomingState) =>
    this.setState({...this.state, ...incomingState}));

  getClassName = () => 'ToteutuksenNimiSection';

  getHeader = () => 'Toteutuksen nimi';

  isMultiLingual = () => true;

  renderContent = () => {
    console.log('ToteutuksenNimiSection:renderContent:state', this.state);
  }

}
