import React, {Component} from 'react';
import {connect, getCssClassName} from '../utils/utils';
import {setSectionDone, setSectionExpansion} from '../stores/SectionStateStore';
import {APP_STATE_SECTION_EXPANSION_MAP} from '../config/states';

const classNames = require('classnames');

export class AbstractSection extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => this.connectToSectionStateMap();

  connectToSectionStateMap = () => connect(APP_STATE_SECTION_EXPANSION_MAP, this, (expansionMap) => this.setState({
    expanded: expansionMap[this.constructor.name] === true,
    active: expansionMap.activeSection === this.constructor.name
  }))

  getSectionCssClass = () => this.isExpanded() ? "expanded-section" : "collapsed-section";

  getControllerCssClass = () => this.isExpanded() ? "expanded-controller" : "collapsed-controller";

  getHeaderCssClass = () => this.isActive() ? "active-header" : "";

  getHeader = () => null;

  renderContent = () => null;

  isActive = () => this.state.active;

  isExpanded = () => this.state.expanded;

  optionallyRenderContent = () => this.isExpanded() ? this.renderContent() : null;

  getControlIcon = () => this.isExpanded() ? "expand_more" : "expand_less";

  toggleState = () => {
    const newState = !this.isExpanded();
    setSectionExpansion(this.constructor.name, newState);
  }

  setSectionDone = () => setSectionDone(this.constructor.name);

  renderHeader = () => (
    <div className={classNames("header", this.getHeaderCssClass())}>
      <div className={classNames("title")}>{this.getHeader()}</div>
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