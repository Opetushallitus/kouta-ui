import React, {Component} from 'react';

export class InfoHeader extends Component {

  getLabel = () => this.props.label;

  render = () => (
    <div className={'info-header'}>
      <i className={'material-icons arrow-icon'}>play_arrow</i>
      <span className={'label'}>{this.getLabel()}</span>
      <i className={'material-icons help-icon'}>help</i>
    </div>
  );
}
