import React from 'react';
import {broadcast, connectComponent} from '../../../../utils/stateUtils';
import {
  APP_EVENT_TOTEUTUKSEN_OSAAMISALA_SELECTION_CHANGE,
  //APP_STATE_KOULUTUS_DETAILS,
  APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS
} from '../../../../config/states';
import {Connectable} from '../../../../components/Connectable';
import {APP_STATE_KOULUTUKSEN_TIEDOT} from "../../../../stores/koulutus/KoulutuksenTiedotStore";
import {APP_STATE_KOULUTUKSEN_OSAAMISALA_OPTIONS} from '../../../../stores/koulutus/KoulutuksenKuvausStore';

export class OsaamisalaSelector extends Connectable {

  componentDidMount = () => connectComponent(this, {
    [APP_STATE_KOULUTUKSEN_OSAAMISALA_OPTIONS]: (options) => this.setState({
      ...this.state,
      options
    }),
    [APP_STATE_TOTEUTUKSEN_OSAAMISALA_SELECTIONS]: (selections) => this.setState({
      ...this.state,
      selections
    })
  });

  getOptions = () => this.state.options || [];

  hasOptions = () => this.getOptions().length > 0;

  getSelections = () => this.state.selections || [];

  isOptionChecked = (option) => this.getSelections()[option.value] === true;

  handleCheckboxChange = (event) => broadcast(APP_EVENT_TOTEUTUKSEN_OSAAMISALA_SELECTION_CHANGE, {
      value: event.target.value,
      selected: event.target.checked
  });

  renderOption = (option, index) => (
    <li key={index}>
      <input type="checkbox" name={''} value={option.value} checked={this.isOptionChecked(option)}
             onChange={this.handleCheckboxChange}/>{option.label}
    </li>
  );

  renderOptionList = () => this.hasOptions() ? (
    <ul className={'osaamisala-list'}>
      {this.getOptions().map(this.renderOption)}
    </ul>
  ) : (
    <span>Valitse ensin koulutus, jolla on osaamisaloja.</span>
  )

  render = () => (
    <div className={'osaamisala-selector'}>
      {this.renderOptionList()}
    </div>
  );
}
