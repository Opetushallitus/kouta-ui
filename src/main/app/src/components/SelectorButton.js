import React, {Component} from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export class SelectorButton extends Component {
  render = () => (
      <div className={"selector-button button-container"}>
        <button onClick={this.props.onClick} className={"big primary"}>Selector button <ArrowDropDownIcon/></button>
      </div>
  )
}