import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {selectWorkflowTutkintoonJohtavaKoulutus} from '../../stores/WorkflowStore';

export class KoulutusListActionBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectorVisible: false
    };
  }

  toggleSelector = () => this.setState({
    selectorVisible: !this.state.selectorVisible
  });

  selectTutkintoonJohtavaKoulutus = () => selectWorkflowTutkintoonJohtavaKoulutus();

  renderSelectorLayer = () => this.state.selectorVisible ? (
      <div className="selector-layer">
          <Link role="button" onClick={this.selectTutkintoonJohtavaKoulutus} to={{
          pathname: "/koulutus"
        }}>Tutkintoon johtava koulutus</Link>
        <Link role="button" to={{
          pathname: "/koulutus"
        }}>Muu koulutus</Link>
      </div>
  ) : null;

  render = () => (
    <div className="koulutus-list-action-bar">
      <h1 className="koulutukset-header">Koulutukset</h1>
      <div className="new-koulutus-selector">
        <button className="new-koulutus-button" onClick={this.toggleSelector}>Luo uusi koulutus</button>
        {this.renderSelectorLayer()}
      </div>
      <button className="file-import-button">Tuo tiedostosta</button>
    </div>
  )
}