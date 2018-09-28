import React, {Component} from 'react';
import {connect, disconnect} from 'metamatic'
import {STATE_KOULUTUS_SELECTOR_VISIBLE} from '../../../../states/AppState';

export class KoulutusSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    connect(this, STATE_KOULUTUS_SELECTOR_VISIBLE, (visible) => this.setState({visible}));
  }

  componentWillUnmount = () => disconnect(this);

  render = () => this.state.visible ? (
      <h1>KoulutusSelector</h1>
  ) : null;

}