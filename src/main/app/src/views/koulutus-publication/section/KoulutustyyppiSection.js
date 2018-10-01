import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {inject, observer} from 'mobx-react/index';

@inject("appStore")
@observer
export class KoulutustyyppiSection extends AbstractSection {

  constructor(props) {
    super(props);
    this.state = {};
  }


  handleCheckboxChange = (event) => {
    this.props.appStore.selectKoulutustyyppi(event.target.value);
  }

  getHeader = () => "2 Valitse koulutustyyppi";

  isExpanded = () => this.props.appStore.koulutustyyppiSectionExpanded;

  isOptionChecked = (option) => option.value === this.props.appStore.koulutustyyppi;

  toggleState = () => (this.props.appStore.setKoulutustyyppiSectionExpanded(!this.isExpanded()));

  renderKoulutustyyppiOption = (koulutustyyppiOption, index) => (
    <li key={index}>
      <input type="radio" name={"koulutustyyppi"} value={koulutustyyppiOption.value} checked={this.isOptionChecked(koulutustyyppiOption)}
             onChange={this.handleCheckboxChange} />{koulutustyyppiOption.label}
    </li>
  )

  renderContent() {
    return (
        <div className={"content"}>
          <ul className={"koulutustyyppi-list"}>
            {this.props.appStore.koulutustyyppiOptions.map(this.renderKoulutustyyppiOption)}
          </ul>
        </div>
    );
  }


}