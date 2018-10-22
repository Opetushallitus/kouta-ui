import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {
  APP_EVENT_KIELIVERSIO_SELECTION_CHANGE,
  APP_EVENT_KIELIVERSIO_SELECTION_CLEAR,
  APP_STATE_KIELIVERSIO_OPTIONS,
  APP_STATE_KIELIVERSIO_SELECTIONS
} from '../../../config/states';
import {broadcast, connectToOne} from '../../../utils/stateUtils';

export class KieliversioSection extends AbstractSection {

  getClassName = () => 'KieliversioSection';

  getHeader = () => 'Kieliversiot';

  getInstruction = () => 'Valitse ne kielet, joilla tiedot julkaistaan Opintopolussa';

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_KIELIVERSIO_OPTIONS, this, (state) => {
      this.setState({...this.state, options: state});
    });
    connectToOne(APP_STATE_KIELIVERSIO_SELECTIONS, this, (state) => {
      this.setState({...this.state, selections: state});
    });
  }

  isOptionChecked = (option) => this.state.selections[option.value] === true;

  handleCheckboxChange = (event) => {
    const value = event.target.value;
    const selected = event.target.checked;
    broadcast(APP_EVENT_KIELIVERSIO_SELECTION_CHANGE, {value, selected});
  }

  onClearButtonClick = () => broadcast(APP_EVENT_KIELIVERSIO_SELECTION_CLEAR);

  renderOption = (option, index) => (
      <li key={index}>
        <input type="checkbox" name={this.getClassName()} value={option.value} checked={this.isOptionChecked(option)}
               onChange={this.handleCheckboxChange}/>{option.label}
      </li>
  );

  renderOptionList = () => this.state.options ? (
      <ul className={this.getClassName() + "-list"}>
        {this.state.options.map(this.renderOption)}
      </ul>
  ) : null;

  renderContent = () => (
      <div className={"content"}>
        {this.getInstruction()}
        {this.renderOptionList()}
      </div>
  );

}