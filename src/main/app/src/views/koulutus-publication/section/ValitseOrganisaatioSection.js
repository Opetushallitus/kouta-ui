import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {APP_STATE_ORGANISAATIO} from '../../../config/states';
import {connect} from '../../../utils/utils';
import {selectOrganisaatio} from '../../../stores/OrganisaatioStore';

export class ValitseOrganisaatioSection extends AbstractSection {

  getHeader = () => "5 Valitse koulutuksen järjestävä organisaatio";

  componentDidMount = () => {
    this.connectToSectionStateMap();
    connect(APP_STATE_ORGANISAATIO, this, (state) => this.setState(state));
  }

  isOptionChecked = (option) => option.value === this.state.activeOrganisaatioId;

  handleCheckboxChange = (event) => {
    const value = event.target.value;
    selectOrganisaatio(value);
    this.setSectionDone();
  }

  renderOrganisaatioOption = (option, index) => (
      <li key={index}>
        <input type="radio" name="organisaatio" value={option.value} checked={this.isOptionChecked(option)}
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