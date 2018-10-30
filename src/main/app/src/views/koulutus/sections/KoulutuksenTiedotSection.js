import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {KoulutusSelector} from '../../../components/KoulutusSelector';
import {KoulutusDetails} from '../../../components/KoulutusDetails';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../config/states';
import {connectListener} from '../../../utils/stateUtils';
import {deselectKoulutus} from '../../../stores/koulutus/KoulutusDetailsStore';

export class KoulutuksenTiedotSection extends AbstractSection {

  onMount = () => connectListener(this, APP_STATE_KOULUTUS_DETAILS, (state) => this.setState({...this.state, ...state}));

  getClassName = () => 'KoulutuksenTiedotSection';

  getHeader = () => 'Koulutuksen tiedot';

  onClearButtonClick = () => deselectKoulutus();

  renderContent = () => (
    <div className={"content"}>
      <KoulutusSelector/>
      <KoulutusDetails/>
    </div>
  )

}
