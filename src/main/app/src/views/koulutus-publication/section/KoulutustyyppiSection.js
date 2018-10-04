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
    this.setState({
      expanded: true,
      koulutustyyppi: event.target.value
    }, () => {
      this.dispatchKoulutustyyppi();
      this.setSectionDone();
    })
  }

  dispatchKoulutustyyppi = () => {
    this.props.appStore.selectKoulutustyyppi(this.state.koulutustyyppi);
  }

  getHeader = () => "2 Valitse koulutustyyppi";

  isOptionChecked = (option) => option.value === this.props.appStore.koulutustyyppi;

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