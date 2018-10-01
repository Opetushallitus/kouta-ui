import React, {Component} from 'react';

import {getCssClassName} from '../utils/utils';

const classNames = require('classnames');


export class AbstractSection extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getSectionCssClass = () => this.isExpanded() ? "expanded-section" : "collapsed-section";

  getControllerCssClass = () => this.isExpanded() ? "expanded-controller" : "collapsed-controller";

  getHeader = () => {
    throw new Error("AbstractSection:getHeader: implement in subclass!")
  }

  renderContent() {
    return null;
  }

  isExpanded = () => this.state.expanded;

  optionallyRenderContent() {
    if (!this.isExpanded()) {
      return null;
    }
    return this.renderContent();
  }

  getControlIcon = () => this.isExpanded() ? "expand_more" : "expand_less";

  toggleState = () => this.setState({expanded: !this.isExpanded()});

  renderHeader = () => (
    <div className={"header"}>
      <div className={"title"}>{this.getHeader()}</div>
      <div className={classNames("controller", this.getControllerCssClass())} onClick={this.toggleState}>
        <i className="material-icons">{this.getControlIcon()}</i>
      </div>
    </div>
  )

  render() {
    return (
        <div className={classNames('section', getCssClassName(this), this.getSectionCssClass())}>
          {this.renderHeader()}
          {this.optionallyRenderContent()}
        </div>
    )
  }


}