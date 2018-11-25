import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {connectComponent} from '../../../utils/stateUtils';
import {APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI} from '../../../stores/hakukohde/HakukohteenAlkamiskausiStore';

export class HakukohteenAlkamiskausiSection extends AbstractSection {

  onMount = () => connectComponent(this, {
    [APP_STATE_HAKUKOHTEEN_ALKAMISKAUSI]: (incomingState) => this.setState({
      ...this.state,
      ...incomingState
    })
  });

  getClassName = () => 'HakukohteenAlkamiskausiSection';

  getHeader = () => 'Koulutuksen alkamiskausi';

  renderContent = () => (
    <div className={'content'}>

    </div>
  );

}
