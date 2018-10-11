import React from 'react';
import {connect} from '../../../utils/utils';
import {AbstractSection} from '../../../components/AbstractSection';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../config/states';

export class KoulutuksenKuvausSection extends AbstractSection {

  getHeader = () => '4 Koulutuksen kuvaus';

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connect(APP_STATE_KOULUTUS_DETAILS, {}, (state) => this.setState({kuvaus: state.kuvaus}));
  }

  isClearButtonVisible = () => false;

  renderContent = () =>
      <div className={"content"} dangerouslySetInnerHTML={{__html: this.state.kuvaus}}/>

}
