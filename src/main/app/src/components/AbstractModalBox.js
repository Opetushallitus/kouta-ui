import React, {Component} from 'react';

export class AbstractModalBox extends Component {

  getOptions = () => this.props.options || [];

  getTitle = () => {
    throw new Error('AbstractModalBox:getTitle: implement in subclass');
  };

  getIcon = () => {
    throw new Error('AbstractModalBox:getIcon: implement in subclass');
  };

  renderContent = () => {
    throw new Error('AbstractModalBox:renderContent: implement in subclass');
  };

  renderHeader = () => (
    <div className={'modal-box-header'}>
      <i className={'material-icons modal-box-title-icon'}>{this.getIcon()}</i>
      <div className={'modal-box-title'}>{this.getTitle()}</div>
      <i className={'material-icons modal-box-close-icon'} onClick={this.props.onClose}>close</i>
    </div>
  );

  renderFooter = () => (
    <div className={'modal-box-footer button-container'}>
      <button className={'secondary big'} onClick={this.props.onClose}>Peruuta</button>
      <button className={'primary big'} onClick={this.props.onClose}>Jatka</button>
    </div>
  );

  render = () => (
    <div className={'modal-box-overlay'}>
      <div className={'modal-box'}>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}</div>
    </div>
  );
}
