import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';

export class HakukohteenKoulutuksenAlkamiskausiSection extends AbstractSection {

  getClassName = () => 'HakukohteenKoulutuksenAlkamiskausiSection';

  getHeader = () => 'Koulutuksen alkamiskausi';

  renderContent = () => (
    <div className={'content'}>

    </div>
  );

}
