import React from 'react';
import {connect, disconnect} from 'metamatic';
import {AbstractSection} from '../../../components/AbstractSection';
import {STATE_SECTION_KOULUTUSTYYPPI_EXPANDED} from '../../../states/AppState';

export class KoulutustyyppiSection extends AbstractSection {

  constructor(props) {
    super(props);
    connect(this, STATE_SECTION_KOULUTUSTYYPPI_EXPANDED, (expanded) => this.setState({expanded}));
  }

  componentWillUnmount = () => disconnect(this);

  renderContent = () => <h1>Content</h1>

  getHeader = () => "2 Valitse koulutustyyppi";


}