import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {SelectorButton} from '../../../components/SelectorButton';
import {logEvent} from '../../../utils/logging';
import {APP_STATE_SECTION_EXPANSION_MAP} from '../../../config/states';
import {connect} from '../../../utils/utils';
export class LuoKoulutusSection extends AbstractSection {

  componentDidMount = () => connect(APP_STATE_SECTION_EXPANSION_MAP, this, (expansionMap) => this.setState({
    expanded: expansionMap[this.constructor.name] === true,
    active: expansionMap.activeSection === this.getClassName()
  }));

  getClassName = () => 'LuoKoulutusSection';

  getHeader = () => '1 Luo koulutus';

  isFooterVisible = () => false;

  getSelectorButtonOptions = () => [
    {
      text: 'Luo uusi koulutus',
      action: () => {
        logEvent('LuoKoulutusSection:action:setSectionDone')
        this.setSectionDone()
      }
    },
    {
      text: 'Käytä aikaisemmin luodun koulutuksen tietoja'
    }
  ];

  preRender = () => {
    logEvent('LuoKoulutusSection:render:state');
    logEvent(this.state);
  }

  renderContent = () => {
    return (
        <div className={"content"}>
          <SelectorButton layerAlign={"left"} label={"LUO UUSI"} options={this.getSelectorButtonOptions()}/>
        </div>
    )
  }

}


