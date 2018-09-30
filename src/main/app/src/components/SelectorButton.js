import React, {Component} from 'react';
import classNames from 'classnames';
export class SelectorButton extends Component {


  constructor(props) {
    super(props);
    this.state = {
      selectorVisible: false
    };
  }

  toggleSelector = () => this.setState({
    selectorVisible: !this.state.selectorVisible
  });

  onSelect = (option) => {
    this.setState({
      selectorVisible: false
    });
    if (option.action) {
      return option.action(option);
    }
    this.props.onSelect(option);
  }

  renderSelectorOption = (option, index) => (
    <span key={index} onClick={() => this.onSelect(option)}>{option.text}</span>
  );

  renderSelectorLayer = () => this.state.selectorVisible ? (
      <div className={classNames("selector-layer", this.props.layerAlign)}>
        {this.props.options.map(this.renderSelectorOption)}
      </div>
  ) : null;

  render = () => (
      <div className={"selector-button button-container"}>
        <button onClick={this.toggleSelector} className={"big primary"}>Selector button <icon className="material-icons"/>arrow_drop_down</button>
        {this.renderSelectorLayer()}
      </div>
  )
}