import React from 'react';
import styled from 'styled-components';
import Input from '../Input';
import Dropdown, {DropdownMenu, DropdownMenuItem} from '../Dropdown';

import { getThemeProp } from '../../theme';

export const Tag = styled.div`
  width: auto;
  height: 26px;
  border-radius: 6px;
  background-color: #979797;
  float: left;
  margin-right: 10px;
  margin-top: 10px;
`;

export const TagText = styled.div`
font-family: ${getThemeProp('typography.fontFamily')};
font-size: 14px;
font-weight: normal;
font-style: normal;
font-stretch: normal;
line-height: 1.07;
letter-spacing: normal;
color: #FFFFFF;
padding: 4px 10px 7px 10px;
`;

export const RemoveButton = styled.div`
font-family: Material Icons;
float: right;
padding-left: 10px;
`;

export class TagSelect extends React.Component {

  static defaultProps = {
    options: [],
    value: [],
    maxTags: 5,
    onChange: () => null,
  };


  constructor(props) {
    super(props);
    this.state = {
        filter: '',
        expanded: false,
    };
  }

getFilter = () => this.state.filter || '';

getOptions = () => this.props.options;

setFilter = (event) => this.setState({
    ...this.state,
    filter: event.target.value,
    expanded: true
});

supportsTags = () => this.props.maxTags && this.props.maxTags > 0;

checkTagCount = () => this.props.value.length < this.props.maxTags;

getFilteredOptions = () => (this.props.options || []).filter(option => option.label.toLowerCase().includes(this.getFilter().toLowerCase()) && !this.hasTagWithKey(option.key));

getTags = () => this.props.value || [];

selectOption = (event) => this.checkTagCount() && this.makeOnChangeOption(event.target.getAttribute('data-id'));

findOptionByKey = (key) => this.getOptions().find(option => option.key === key);

hasTagWithKey = (key) => this.getTags().find(tag => tag.key === key);

makeOnChangeOption = key => {
  const {onChange} = this.props
  onChange(key);
};

getKeyFromFirstFilteredOption = () => (this.getFilteredOptions().shift() || {}).key;

selectOnEnterKey = (event) => event.keyCode === 13 && this.makeOnChangeOption(this.getKeyFromFirstFilteredOption());

toggleExpanded = () => this.setState({
    ...this.state,
    expanded: !this.state.expanded 
});

renderOption = (option, index) => (
    <DropdownMenuItem key={index} data-id={option.key} onClick={this.selectOption}>
        {option.label}
    </DropdownMenuItem>
);

renderOptionList = () => this.state.expanded && (
    <DropdownMenu style={{'maxWidth': '439px'}}>
          {this.getFilteredOptions().map(this.renderOption)}
    </DropdownMenu>
);

renderTag = (option, index) => (
    <Tag key={index}>
        <TagText>{option.label}
          <RemoveButton onClick={() => this.makeOnChangeOption(option.key)}>clear</RemoveButton>
        </TagText>
    </Tag>
);

renderTags = () => this.supportsTags() && (
    <div>
        {this.getTags().map(this.renderTag)}
    </div>
);

render = () => (
    <div>
        <div>
            <Input style={{'maxWidth': '439px'}} value={this.getFilter()} onChange={this.setFilter}
                   onKeyDown={this.selectOnEnterKey} onClick={this.toggleExpanded}/>
        </div>
        {this.renderOptionList()}
        {this.renderTags()}
    </div>
);
}
