import React from 'react';

export class KoulutusSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => this.state.visible ? (
      <h1>KoulutusSelector</h1>
  ) : null;

}