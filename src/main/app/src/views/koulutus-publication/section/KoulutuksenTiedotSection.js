import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {KoulutusSelector} from '../../../components/KoulutusSelector';
import {KoulutusDetails} from '../../../components/KoulutusDetails';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../config/states';
import {connectToOne} from '../../../utils/stateUtils';
import {deselectKoulutus} from '../../../stores/KoulutusDetailsStore';

export class KoulutuksenTiedotSection extends AbstractSection {

  componentDidMount = () =>  {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_KOULUTUS_DETAILS, this, (state) => this.setState({...this.state, ...state}));
  }

  getClassName = () => 'KoulutuksenTiedotSection';

  getHeader = () => "3 Koulutuksen tiedot";

  onClearButtonClick = () => deselectKoulutus();

  renderContent = () => (
    <div className={"content"}>
      <KoulutusSelector/>
      <KoulutusDetails/>
    </div>
  )

}