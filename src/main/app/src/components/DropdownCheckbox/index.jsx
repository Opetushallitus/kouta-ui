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

  static defaultProps = {
    options: [],
    value: [],
    onChange: () => null,
  };

  constructor(props) {
    super(props);

    this.state = {
        expanded: false,
    };
  }

  toggleExpanded = () => this.setState({
    ...this.state,
    expanded: !this.state.expanded
  });

  getOptions = () => this.props.options || [];

  getSelected = () => this.props.value || [];

  makeOnChangeOption = key => e => {
    const {onChange} = this.props
    const target = e.target;
    const checked = target.type === 'checkbox' ? target.checked : target.value;
    onChange(key, checked);
  };

  findSelectedByKey = (key) => this.getSelected().find(option => option.key === key);

  renderOption = (option, index) => (
      <DropdownMenuItem key={index}>
          <Checkbox onChange={this.makeOnChangeOption(option.key)} checked={this.findSelectedByKey(option.key)}>{option.label}</Checkbox>
      </DropdownMenuItem>
  );
  
  renderOptionList = () => this.state.expanded && (
      <DropdownMenu style={{'maxWidth': '439px'}}>
            {this.props.options.map(this.renderOption)}
      </DropdownMenu>
  );

  render = () => (
      <div>
          <div>
              <SelectBase style={{'maxWidth': '439px'}} onClick={this.toggleExpanded}>
              </SelectBase>
          </div>
          {this.renderOptionList()}
      </div>
  );

}
