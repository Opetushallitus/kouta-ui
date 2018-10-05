import React, {Component} from 'react';
import {connect, getCssClassName} from '../utils/utils';
import {APP_STATE_KOULUTUS_DETAILS} from '../config/constants';

export class KoulutusDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => connect(APP_STATE_KOULUTUS_DETAILS, this, (state) => this.setState(state));

  renderDetailsRow = (label, value) => (
    <div className={"details-row"}>
      <div className={"label-column"}>{label}</div>
      <div className={"value-column"}>{value}</div>
    </div>
  )

  render = () => this.state.active ?  (
    <div className={getCssClassName(this)}>
      {this.renderDetailsRow('Koulutus:', this.state.nimi)}
      {this.renderDetailsRow('Koulutusala:', this.state.koulutusala)}
      {this.renderDetailsRow('Laajuus:', this.state.opintojenLaajuus)}
    </div>
  ) : null;
}