import React, {Component} from 'react';

export class ActionLink extends Component {

  getLabel = () => this.props.label;

  getIcon = () => this.props.icon || 'add_box';

  render = () => (
    <div className={'action-link'} onClick={this.props.onClick}>
      <i className={'material-icons icon'}>add_box</i>
      <span className={'link'}>{this.getLabel()}</span>
    </div>
  )
}
