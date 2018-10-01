import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {inject, observer} from 'mobx-react/index';
import {KoulutusSelector} from '../../../components/KoulutusSelector';

@inject("appStore")
@observer
export class KoulutuksenTiedotSection extends AbstractSection {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getHeader = () => "3 Koulutuksen tiedot";

  isExpanded = () => this.props.appStore.koulutuksenTiedotSectionExpanded;

  toggleState = () => this.props.appStore.setKoulutuksenTiedotSectionExpanded(!this.isExpanded());

  renderContent = () => (
    <div className={"content"}>
      <KoulutusSelector/>
    </div>
  )

}