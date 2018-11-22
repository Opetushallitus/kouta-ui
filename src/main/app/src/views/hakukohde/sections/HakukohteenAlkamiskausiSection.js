import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';

export class HakukohteenAlkamiskausiSection extends AbstractSection {

  getClassName = () => 'HakukohteenAlkamiskausiSection';

  getHeader = () => 'Koulutuksen alkamiskausi';

  renderContent = () => (
    <div className={'content'}>

    </div>
  );

}
