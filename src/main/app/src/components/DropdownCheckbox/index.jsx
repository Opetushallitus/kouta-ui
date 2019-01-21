import React, { Component } from 'react';
import styled from 'styled-components';
import Dropdown, {DropdownMenu, DropdownMenuItem} from '../Dropdown';
import Checkbox from '../Checkbox';
import Input from '../Input';

export const SelectBase = styled(Input).attrs({ as: 'select' })`
  height: calc(2.25rem + 2px);
`;

export class DropdownCheckbox extends Component {
    static defaultProps = {
      toggleOnOverlayClick: false,
      overlay: null,
      value: [],
      defaultVisible: false,
      children: () => null,
    };
  
    constructor(props) {
      super(props);
  
      this.state = {
        visible: props.defaultVisible,
      };
  
      this.overlayRef = React.createRef();
    }
  
    onToggle = () => {
    this.setState(state => ({
        visible: !state.visible,
      }));
    };

    getOptions = () => this.props.overlay || [];

    getSelected = () => this.props.value || [];
  
    onOverlayClick = () => {
      if (this.props.toggleOnOverlayClick) {
        this.onToggle();
      }
    };

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
    
    renderOptionList = () => this.state.visible && (
        <DropdownMenu style={{'maxWidth': '439px'}}>
              {this.props.overlay.map(this.renderOption)}
        </DropdownMenu>
    );
  
    render() {
      const { visible } = this.state;
      const {
        defaultVisible,
        children,
        overlay,
        toggleOnOverlayClick,
        ...props
      } = this.props;
  
      const wrappedOverlay = <div onClick={this.onOverlayClick}>{this.renderOptionList()}</div>;
  
      return (
        <Dropdown visible={visible} overlay={wrappedOverlay} {...props}>
          {({ ref }) => {
            return children({ ref, visible, onToggle: this.onToggle });
          }}
        </Dropdown>
      );
    }
  }