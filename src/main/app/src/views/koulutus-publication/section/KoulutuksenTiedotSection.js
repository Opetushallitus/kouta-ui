import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {KoulutusSelector} from '../../../components/KoulutusSelector';
import {KoulutusDetails} from '../../../components/KoulutusDetails';
import {connect, isVariableDefined} from '../../../utils/utils';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../config/states';
import {deselectKoulutus} from '../../../stores/KoulutusListStore';

export class KoulutuksenTiedotSection extends AbstractSection {

  componentDidMount = () =>  {
    this.connectToSectionStateMap();
    connect(APP_STATE_KOULUTUS_DETAILS, this, (state) => this.setState({...this.state, ...state}));
  }

  getClassName = () => 'KoulutuksenTiedotSection';

  getHeader = () => "3 Koulutuksen tiedot";

  isValid = () => isVariableDefined(this.state.nimi);

  onClearButtonClick = () => deselectKoulutus();

  renderContent = () => (
    <div className={"content"}>
      <KoulutusSelector/>
      <KoulutusDetails/>
    </div>
  )

}