import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {APP_EVENT_SECTION_VALIDATION_REQUEST, APP_STATE_ORGANISAATIO, APP_STATE_ORGANISAATIO_SELECTION_MAP} from '../../../config/states';
import {clearOrganisaatioSelections, selectOrganisaatio} from '../../../stores/OrganisaatioStore';
import {broadcast, connectToOne} from '../../../utils/stateUtils';

export class ValitseOrganisaatioSection extends AbstractSection {

  getClassName = () => 'ValitseOrganisaatioSection';

  getHeader = () => '5 Valitse koulutuksen järjestävä organisaatio';

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connectToOne(APP_STATE_ORGANISAATIO, this, (state) => {
      this.setState({...this.state, ...state});
    });
    connectToOne(APP_STATE_ORGANISAATIO_SELECTION_MAP, this, (state) => this.setState({...this.state, organisaatioSelectionMap: state}));
  }

  isOrganisaatioSelected = (organisaatioId) => (this.state.organisaatioSelectionMap || {})[organisaatioId] === true;

  isOptionChecked = (option) => this.isOrganisaatioSelected(option.value);

  handleCheckboxChange = (event) => {
    const value = event.target.value;
    const selected = event.target.checked
    selectOrganisaatio(value, selected);
    this.setSectionDone();
    broadcast(APP_EVENT_SECTION_VALIDATION_REQUEST, this.getClassName());
  }

  isAnyOrganisaatioSelected = () => Object.values(this.state.organisaatioSelectionMap).filter(value => value === true).length > 0;

  isValid = () => this.isAnyOrganisaatioSelected();

  onClearButtonClick = () => clearOrganisaatioSelections();

  renderOrganisaatioOption = (option, index) => (
      <li key={index}>
        <input type="checkbox" name="organisaatio" value={option.value} checked={this.isOptionChecked(option)}
               onChange={this.handleCheckboxChange}/>{option.label}
      </li>
  );

  renderOrganisaatioList = () => this.state.options ? (
      <ul className={"organisaatio-list"}>
        {this.state.options.map(this.renderOrganisaatioOption)}
      </ul>
  ) : null;

  renderContent = () => (
      <div className={"content"}>
        {this.renderOrganisaatioList()}
      </div>
  );

}