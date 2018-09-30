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

  getSectionCssClass = () => this.state.expanded ? "expanded-section" : "collapsed-section";

  getControllerCssClass = () => this.state.expanded ? "expanded-controller" : "collapsed-controller";

  getHeader = () => {
    throw new Error("AbstractSection:getHeader: implement in subclass!")
  }

  renderContent = () => null;

  optionallyRenderContent = () => this.state.expanded ? this.renderContent() : null;

  getControlIcon = () =>  this.state.expanded ? "expand_more" : "expand_less";

  toggleState = () => this.setState({expanded: !this.state.expanded});

  renderHeader = () => (
    <div className={"header"}>
      <div className={"title"}>{this.getHeader()}</div>
      <div className={classNames("controller", this.getControllerCssClass())} onClick={this.toggleState}>
        <i className="material-icons">{this.getControlIcon()}</i>
      </div>
    </div>
  )

  render = () => (
    <div className={classNames('section', getCssClassName(this), this.getSectionCssClass())}>
      {this.renderHeader()}
      {this.optionallyRenderContent()}
    </div>
  )

}