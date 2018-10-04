import React, {Component} from 'react';

import {getCssClassName} from '../utils/utils';
import {getAppStore} from '../stores/AppStore';

const classNames = require('classnames');


export class AbstractSection extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getSectionCssClass = () => this.isExpanded() ? "expanded-section" : "collapsed-section";

  getControllerCssClass = () => this.isExpanded() ? "expanded-controller" : "collapsed-controller";

  getHeaderCssClass = () => this.isActive() ? "active-header" : "";

  getHeader = () => null;

  renderContent() {
    return null;
  }

  isActive = () => getAppStore().activeSection === this.constructor.name;

  isExpanded = () => this.state.expanded || this.isActive();

  optionallyRenderContent = () => this.isExpanded() ? this.renderContent() : null;

  getControlIcon = () => this.isExpanded() ? "expand_more" : "expand_less";

  notifyStoreOnExpansion = () => {
    if (!this.isExpanded()) {
      return;
    }
    getAppStore().setActiveSection(this.constructor.name);
  }

  toggleState = () => this.setState({expanded: !this.isExpanded()}, () => this.notifyStoreOnExpansion());

  setSectionDone = () => getAppStore().setSectionDone(this.constructor.name);

  renderHeader = () => (
    <div className={classNames("header", this.getHeaderCssClass())}>
      <div className={classNames("title")}>{this.getHeader()}</div>
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