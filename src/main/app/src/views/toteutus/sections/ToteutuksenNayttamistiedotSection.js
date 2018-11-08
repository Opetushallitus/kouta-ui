import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';

export class ToteutuksenNayttamistiedotSection extends AbstractSection {

  getClassName = () => 'ToteutuksenNayttamistiedotSection';

  getHeader = () => 'Koulutuksen näyttämiseen liittyvät tiedot';

  renderContent = () => (
    <div className={'content'}>
      Drop
    </div>
  );

}
