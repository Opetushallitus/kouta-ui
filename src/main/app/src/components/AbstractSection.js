import React, {Component} from 'react';
import {setSectionDone, setSectionExpansion} from '../stores/SectionStateStore';
import {APP_EVENT_SECTION_CLEAR_CLICK, APP_EVENT_SECTION_SUBMIT_CLICK, APP_STATE_SECTION_EXPANSION_MAP} from '../config/states';
import {broadcast, connectToOne} from '../utils/stateUtils';

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

  connectToSectionStateMap = () => connectToOne(APP_STATE_SECTION_EXPANSION_MAP, this, (expansionMap) => this.setState({
    expanded: expansionMap[this.getClassName()] === true,
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

  isClearButtonVisible = () => this.state.visibleClearButton;

  isSubmitButtonVisible = () => this.state.visibleSubmitButton;

  isValid = () => false;

  optionallyRenderContent = () => this.isExpanded() ? this.renderContent() : null;

  optionallyRenderFooter = () => this.isExpanded() && this.isFooterVisible() ? this.renderFooter() : null;

  getControlIcon = () => this.isExpanded() ? "expand_more" : "expand_less";

  toggleState = () => {
    const newState = !this.isExpanded();
    const className = this.getClassName();
    setSectionExpansion(className, newState);
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

  handleSubmitButtonClick = () => {
    this.onSubmitButtonClick();
    broadcast(APP_EVENT_SECTION_SUBMIT_CLICK)
  }

  handleClearButtonClick = () => {
    this.onClearButtonClick();
    broadcast(APP_EVENT_SECTION_CLEAR_CLICK);
  }

  onClearButtonClick = () => {};

  onSubmitButtonClick = () => this.setSectionDone();

  renderClearButton = () => this.isClearButtonVisible() ? (
      <button className={"clear-button small secondary clear-button"} onClick={this.handleClearButtonClick}>{this.getClearButtonText()}</button>
  ) : null;

  renderSubmitButton = () => (this.isSubmitButtonVisible() && this.isValid()) ? (
      <button className={"small primary submit-button"} onClick={this.handleSubmitButtonClick}>{this.getSubmitButtonText()}</button>
  ) : null;

  renderFooter = () => (
      <div className={classNames("footer button-container")}>
        {this.renderClearButton()}
        <div className={"spacer"}/>
        {this.renderSubmitButton()}
      </div>
  )

  render = () => (
      <div className={classNames('section', 'abstract-section', this.getSectionCssClass())}>
        {this.renderHeader()}
        {this.optionallyRenderContent()}
        {this.optionallyRenderFooter()}
      </div>
  )
}