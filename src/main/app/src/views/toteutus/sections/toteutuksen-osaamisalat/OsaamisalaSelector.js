import React from 'react';
import {connectListener} from '../../../../utils/stateUtils';
import {APP_STATE_KOULUTUS_DETAILS} from '../../../../config/states';
import {Connectable} from '../../../../components/Connectable';

export class OsaamisalaSelector extends Connectable {

  componentDidMount = () => connectListener(this, APP_STATE_KOULUTUS_DETAILS, (state) => {
    this.setState(state);
  });

  getOsaamisalaOptions = () => this.state.osaamisalaOptions || [];

  renderCheckboxes = () => {
    const list = this.getOsaamisalaOptions();
    return (<div>
      OsaamisalaSelector
    </div>);
  };

  render = () => (
    <div className={'osaamisala-selector'}>
      {this.renderCheckboxes()}
    </div>
  );
}
