import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {OsaamisalaSelector} from './toteutuksen-osaamisalat/OsaamisalaSelector';
import {OsaamisalaViewer} from './toteutuksen-osaamisalat/OsaamisalaViewer';

export class ToteutuksenOsaamisalatSection extends AbstractSection {

  getClassName = () => 'ToteutuksenOsaamisalatSection';

  getHeader = () => 'Valitse osaamisalat';

  renderContent = () => (
    <div className={"content"}>
      <OsaamisalaSelector/>
      <OsaamisalaViewer/>
    </div>
  )

}
