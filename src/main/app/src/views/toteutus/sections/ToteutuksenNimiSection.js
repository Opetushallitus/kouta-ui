import {AbstractSection} from '../../../components/AbstractSection';
import {connectListener} from '../../../utils/stateUtils';
import {APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES} from '../../../config/states';

export class ToteutuksenNimiSection extends AbstractSection {

  onMount = () => connectListener(this, APP_STATE_TOTEUTUKSEN_KIELIVERSIO_SUPPORTED_LANGUAGES, (supportedLanguages) =>
    this.setState({...this.state, supportedLanguages}));

  getClassName = () => 'ToteutuksenNimiSection';

  getHeader = () => 'Toteutuksen nimi';


  renderContent = () => {
    console.log('ToteutuksenNimiSection:renderContent:state', this.state);
  }

}
