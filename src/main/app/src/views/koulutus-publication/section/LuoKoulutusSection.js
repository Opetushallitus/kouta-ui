import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {inject, observer} from 'mobx-react';

const classNames = require('classnames');

@inject("appStore")
@observer
export class LuoKoulutusSection extends AbstractSection {

  constructor(props) {
    super(props);
    this.state = {
      expanded: true
    };
  }

  getHeader = () => "1 Luo koulutus";

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => this.props.appStore.setKoulutustyyppiSectionExpanded(true)
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja'
    }
  ];

  renderContent() {
    return (
        <div className={"content"}>
          <SelectorButton layerAlign={"left"} label={"LUO UUSI"} onSelect={this.createNewKoulutus} options={this.getSelectorButtonOptions()}/>
        </div>
    )
  }
}


