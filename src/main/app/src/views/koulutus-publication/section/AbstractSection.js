import React, {Component} from 'react';
const classNames = require('classnames');
const snake = require('to-snake-case');

export class AbstractSection extends Component {


  getCssClassName = () => snake(this.constructor.name).replace(/_/g, '-');

  getHeader = () => {
    throw new Error("AbstractSection:getHeader: implement in subclass!")
  }

  renderHeader = () => (
    <div className={"header"}>
      <div className={"title"}>{this.getHeader()}</div>
      <div className={"controller"}>
        <i class="fas fa-sort-down"></i>
      </div>
    </div>
  )

  renderContent = () => null;

  render = () => (
      <div className={classNames('section', this.getCssClassName())}>
        {this.renderHeader()}
        {this.renderContent()}
      </div>
  )

}