import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {getCssClassName} from '../utils/utils';

@inject("koulutusDetailsStore")
@observer
export class KoulutusDetails extends Component {
  
  renderDetailsRow = (label, value) => (
      <div className={"details-row"}>
        <div className={"label-column"}>{label}</div>
        <div className={"value-column"}>{value}</div>
      </div>
  )

  render = () => this.props.koulutusDetailsStore.active ?  (
    <div className={getCssClassName(this)}>
      {this.renderDetailsRow('Koulutusala:', this.props.koulutusDetailsStore.koulutusala)}
      {this.renderDetailsRow('Laajuus:', this.props.koulutusDetailsStore.opintojenLaajuus)}
    </div>
  ) : null;
}