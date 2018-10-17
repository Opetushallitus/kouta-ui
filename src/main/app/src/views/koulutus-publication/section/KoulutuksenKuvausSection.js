import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../config/states';
import {connectToOne} from '../../../utils/stateUtils';

export class KoulutuksenKuvausSection extends AbstractSection {

  getClassName = () => 'KoulutuksenKuvausSection';

  getHeader = () => '4 Koulutuksen kuvaus';

  isValid = () => true;

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_KOULUTUS_DETAILS, this, (state) => this.setState({kuvaus: state.kuvaus}));
  }

  isClearButtonVisible = () => false;

  renderContent = () => this.state.kuvaus ? (
      <div className={"content"} dangerouslySetInnerHTML={{__html: this.state.kuvaus}}/>
  ) : (
      <div className={"content"}>
        <span className={"kuvaus-warning-span"}>Koulutukselle ei ole määritelty kuvausta.</span>
      </div>
  )
}
