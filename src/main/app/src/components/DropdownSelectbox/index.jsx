import React, { Component } from 'react';
import styled from 'styled-components';
import Dropdown, {DropdownMenu, DropdownMenuItem} from '../Dropdown';
import Checkbox from '../Checkbox';
import Input from '../Input';
import { getThemeProp } from '../../theme';

const SelectBase = styled(Input).attrs({ as: 'select' })`
  height: calc(2.25rem + 2px);
`;

export class DropdownCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selected: [],
        expanded: false,
    };
  }

  getSelected = () => this.state.selected || [];

  getOptions = () => this.props.options || [];

  findOptionByKey = (key) => this.getOptions().find(option => option.key === key);

  findSelectedByKey = (key) => this.getSelected().find(option => option.key === key);

  addOptionByKey = (key) => this.findSelectedByKey(key) ? this.getSelected() : this.getSelected().concat([{...this.findOptionByKey(key)}]);

  selectOptionByKey = (key) => key && this.setState({
      selected: this.addOptionByKey(key)
  });

  removeOption = (key) => this.setState({
    ...this.state,
    selected: this.getSelected().filter(option => option.key !== key)
  });
  
  toggleExpanded = () => this.setState({
      ...this.state,
      expanded: !this.state.expanded
  });
  
  setOption = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const key = target.getAttribute('data-id');
    if(value){
      this.selectOptionByKey(key);
    }else{
      this.removeOption(key);
    }
  };

  setCheckedValue = (key) => {
    if(this.findSelectedByKey(key)){
      return true;
    }else{
      return false;
    }
  };

  renderOption = (option, index) => (
      <DropdownMenuItem key={index}>
          <Checkbox data-id={option.key} onChange={this.setOption} checked={this.setCheckedValue(option.key)}>{option.label}</Checkbox>
      </DropdownMenuItem>
  );
  
  renderOptionList = () => this.state.expanded && (
      <DropdownMenu style={{'maxWidth': '439px'}}>
            {this.props.options.map(this.renderOption)}
      </DropdownMenu>
  );

  // renderSelectedOptions() and renderSelectedOption() are used for testing the option adding/removing from selected array.
  renderSelectedOption = (option, index) => (
    <div key={index}>
        <p>{option.label}
        </p>
    </div>
  );

  renderSelectedOptions = () => (
      <div>
          {this.getSelected().map(this.renderSelectedOption)}
      </div>
  );

  render = () => (
      <div>
          <div>
              <SelectBase value={this.props.options[0]} style={{'maxWidth': '439px'}} onClick={this.toggleExpanded}>
              </SelectBase>
          </div>
          {this.renderOptionList()}
          {this.renderSelectedOptions()}
      </div>
  );

}
