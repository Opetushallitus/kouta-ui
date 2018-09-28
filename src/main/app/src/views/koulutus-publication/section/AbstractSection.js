import React, {Component} from 'react';
import {getCssClassName} from '../../../utils/utils';
const classNames = require('classnames');


export class AbstractSection extends Component {




  getHeader = () => {
    throw new Error("AbstractSection:getHeader: implement in subclass!")
  }

  renderHeader = () => (
    <div className={"header"}>
      <div className={"title"}>{this.getHeader()}</div>
      <div className={"controller"}>
        <i className="fas fa-sort-down"></i>
      </div>
    </div>
  )

  renderContent = () => null;

  render = () => (
      <div className={classNames('section', getCssClassName(this))}>
        {this.renderHeader()}
        {this.renderContent()}
      </div>
  )

}