import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {inject, observer} from 'mobx-react';
import {KoulutusSelector} from '../../../components/KoulutusSelector';
import {KoulutusDetails} from '../../../components/KoulutusDetails';

@inject("appStore")
@observer
export class KoulutuksenTiedotSection extends AbstractSection {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getHeader = () => "3 Koulutuksen tiedot";

  renderContent = () => (
    <div className={"content"}>
      <KoulutusSelector/>
      <KoulutusDetails/>
    </div>
  )

}