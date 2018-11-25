import React, {Component} from 'react';

export const LAYOUT = {
  RADIO: 'radio',
  CHECKBOX: 'checkox'
}

export class ContentfulOptionRenderer extends Component {

  getOptions = () => this.props.options || [];

  getName = () => this.props.name;

  handleoptionChange = (event) => this.props.onChange({
    key: event.target.value,
    active: event.target.checked
  });

  getContentRenderer = () => this.props.renderContent || function (content) {return null};

  optionallyRenderContent = (option) => option.content && this.getContentRenderer()(option.content, this.props.active);

  getLayout = () => this.props.layout || 'radio';

  renderOption = (option, index) => (
    <li key={index}>
      <div className={'row'}>
        <input type={this.getLayout()} name={this.getName()} value={option.key} checked={option.active === true}
               onChange={this.handleoptionChange}/>{option.label}
      </div>
      {this.optionallyRenderContent(option)}
    </li>
  );

  renderOptionList = () => (
    <ul className={'option-list'}>
      {this.getOptions().map(this.renderOption)}
    </ul>
  );

  renderContent = () => this.props.content;

  render = () => (
    <div className={'contentful-option-selector'}>
      {this.renderOptionList()}
    </div>
  );
}
