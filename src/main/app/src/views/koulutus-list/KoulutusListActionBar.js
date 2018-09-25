import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export class KoulutusListActionBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectorVisible: false
    };
  }

  toggleSelector = () => {
    this.setState( {
      selectorVisible: !this.state.selectorVisible
    });
  };

  renderSelectorLayer = () => this.state.selectorVisible ? (
      <div className="selector-layer">
          <Link role="button" onClick={this.toggleSelector} to={{
          pathname: "/tutkintoon-johtava-koulutus"
        }}>Tutkintoon johtava koulutus</Link>
        <Link role="button" to={{
          pathname: "/muu-koulutus"
        }}>Muu koulutus</Link>
      </div>
  ) : null;

  render = () => (
    <div className="koulutukset-action-bar">
      <h1 className="koulutukset-header">Koulutukset</h1>
      <div className="new-koulutus-selector">
        <button className="new-koulutus-button" onClick={this.toggleSelector}>Luo uusi koulutus</button>
        {this.renderSelectorLayer()}
      </div>
      <button className="file-import-button">Tuo tiedostosta</button>
    </div>
  )
}