import React, {Component} from 'react';
import {connect} from '../utils/utils';
import {setSectionDone, setSectionExpansion} from '../stores/SectionStateStore';
import {APP_STATE_SECTION_EXPANSION_MAP} from '../config/states';
import {logEvent} from '../utils/logging';

const classNames = require('classnames');

export class AbstractSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleClearButton: true,
      visibleSubmitButton: true,
      visibleFooter: true,
    };
  }

  componentDidMount = () => this.connectToSectionStateMap();

  connectToSectionStateMap = () => connect(APP_STATE_SECTION_EXPANSION_MAP, this, (expansionMap) => this.setState({
    expanded: expansionMap[this.constructor.name] === true,
    active: expansionMap.activeSection === this.getClassName()
  }))


  getClassName = () => 'AbstractSection';

  getSectionCssClass = () => this.isExpanded() ? "expanded-section" : "collapsed-section";

  getControllerCssClass = () => this.isExpanded() ? "expanded-controller" : "collapsed-controller";

  getHeaderCssClass = () => this.isActive() ? "active-header" : "";

  getHeader = () => null;

  renderContent = () => null;

  isActive = () => this.state.active;

  isExpanded = () => this.state.expanded;

  isFooterVisible = () => this.state.visibleFooter;

  isClearButtonVisible = () => this.state.visibleClearButton

  isSubmitButtonVisible = () => this.state.visibleSubmitButton;

  optionallyRenderContent = () => this.isExpanded() ? this.renderContent() : null;

  optionallyRenderFooter = () => this.isExpanded() && this.isFooterVisible() ? this.renderFooter() : null;

  getControlIcon = () => this.isExpanded() ? "expand_more" : "expand_less";

  toggleState = () => {
    const newState = !this.isExpanded();
    logEvent('AbstractSection:ToggleState:newState', newState);
    setSectionExpansion(this.getClassName(), newState);
  }

  setSectionDone = () => setSectionDone(this.getClassName());

  renderHeader = () => (
    <div className={classNames("header", this.getHeaderCssClass())}>
      <div className={classNames("title")}>{this.getHeader()}</div>
      <div className={classNames("controller", this.getControllerCssClass())} onClick={this.toggleState}>
        <i className="material-icons">{this.getControlIcon()}</i>
      </div>
    </div>
  )

  getClearButtonText = () => 'Tyhjennä';

  getSubmitButtonText = () => 'Jatka';

  onClearButtonClick = () => {
  };

  onSubmitButtonClick = () => this.setSectionDone();

  renderClearButton = () => this.isClearButtonVisible() ? (
      <button className={"clear-button small secondary clear-button"} onClick={this.onClearButtonClick}>{this.getClearButtonText()}</button>
  ) : null;

  renderSubmitButton = () => this.isSubmitButtonVisible() ? (
      <button className={"clear-button small primary submit-button"} onClick={this.onSubmitButtonClick}>{this.getSubmitButtonText()}</button>
  ) : null;

  renderFooter = () => (
      <div className={classNames("footer button-container")}>
        {this.renderClearButton()}
        <div className={"spacer"}/>
        {this.renderSubmitButton()}
      </div>
  )

  preRender = () => {}

  render = () => {
    this.preRender();
    return (
        <div className={classNames('section', 'abstract-section', this.getSectionCssClass())}>
          {this.renderHeader()}
          {this.optionallyRenderContent()}
          {this.optionallyRenderFooter()}
        </div>
    )
  }
}