import React, {Component} from 'react';

import {getCssClassName} from '../utils/utils';
const classNames = require('classnames');

export class AbstractSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
  }

  getStateCssClass = () => this.state.expanded? "expanded-section" : "collapsed-section";

  getHeader = () => {
    throw new Error("AbstractSection:getHeader: implement in subclass!")
  }

  renderContent = () => null;

  optionallyRenderContent = () => this.state.expanded ? this.renderContent() : null;

  getControlIcon = () =>  this.state.expanded ? "arrow_drop_down" : "arrow_drop_up";

  renderHeader = () => (
    <div className={"header"}>
      <div className={"title"}>{this.getHeader()}</div>
      <div className={"controller"}>
        <i className="material-icons">{this.getControlIcon()}</i>
      </div>
    </div>
  )

  render = () => (
      <div className={classNames('section', getCssClassName(this), this.getStateCssClass())}>
        {this.renderHeader()}
        {this.optionallyRenderContent()}
      </div>
  )

}