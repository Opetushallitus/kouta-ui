import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {KoulutuskoodiSelector} from './koulutuksen-tiedot/KoulutuskoodiSelector';
import {KoulutusDetails} from './koulutuksen-tiedot/KoulutusDetails';
import {broadcast, connectListener} from '../../../utils/stateUtils';
import {APP_EVENT_SELECT_KOULUTUSKOODI} from "../../../stores/koulutus/KoulutusStore";
import {APP_STATE_KOULUTUKSEN_TIEDOT} from "../../../stores/koulutus/KoulutuksenTiedotStore";

export class KoulutuksenTiedotSection extends AbstractSection {

  onMount = () => connectListener(this, APP_STATE_KOULUTUKSEN_TIEDOT, (state) => this.setState({...this.state, ...state}));

  getClassName = () => 'KoulutuksenTiedotSection';

  getHeader = () => 'Koulutuksen tiedot';

  onClearButtonClick = () => broadcast(APP_EVENT_SELECT_KOULUTUSKOODI);

  renderContent = () => (
    <div className={"content"}>
      <KoulutuskoodiSelector/>
      <KoulutusDetails/>
    </div>
  )

}
