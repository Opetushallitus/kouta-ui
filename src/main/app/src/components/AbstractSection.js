import React, {Component} from 'react';
import {registerSection, selectTab, setSectionDone, setSectionExpansion} from '../stores/generic/SectionStateStore';
import {
  APP_EVENT_SECTION_VALIDATION_REQUEST,
  APP_STATE_SECTION_EXPANSION_MAP,
  APP_STATE_SECTION_TAB_MAP
} from '../config/states';
import {broadcast, connectComponent, disconnectListener} from '../utils/stateUtils';
import {toCssCase} from '../utils/stringUtils';
import {LANGUAGE_CODE_TO_TAB_NAME} from '../config/constants';

const classNames = require('classnames');

export class AbstractSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visibleClearButton: true,
      visibleSubmitButton: true,
      visibleFooter: true
    };
  }

  componentDidMount = () => {
    this.connectToSectionStateMap();
    this.onMount();
  };

  componentWillUnmount = () => disconnectListener(this);

  onMount = () => null;

  connectToSectionStateMap = () => {
    registerSection(this.getClassName());
    connectComponent(this, {
      [APP_STATE_SECTION_EXPANSION_MAP]: (expansionMap) => this.setState({
        expanded: expansionMap[this.getClassName()] === true,
        active: expansionMap.activeSection === this.getClassName()
      }),
      [APP_STATE_SECTION_TAB_MAP]: (sectionMap) => this.setState({
        ...this.state,
        activeTabId: sectionMap[this.getClassName()]
      }),
      [this.getSupportedLanguagesStateName()]: (supportedLanguages) =>
        this.setState({...this.state, supportedLanguages})
    });
  }

  getSupportedLanguagesStateName = () => 'REDEFINE_STATE_NAME_IN_SUBCLASS';

  getClassName = () => 'AbstractSection';

  getCssClassName = () => toCssCase(this.getClassName());

  getExpansionStateCssClass = () => this.isExpanded() ? "expanded-section" : "collapsed-section";

  getControllerCssClass = () => this.isExpanded() ? "expanded-controller" : "collapsed-controller";

  getHeaderCssClass = () => this.isActive() ? "active-header" : "";

  getNumberedHeader = () => `${this.getOrderNumber()} ${this.getHeader()}`.trim();

  getHeader = () => null;

  getOrderNumber = () => this.props.orderNumber || '';

  renderContent = () => null;

  isActive = () => this.state.active;

  isExpanded = () => this.state.expanded;

  isFooterVisible = () => this.state.visibleFooter;

  isClearButtonVisible = () => this.state.visibleClearButton;

  isSubmitButtonVisible = () => this.state.visibleSubmitButton;

  isValid = () => true;

  isMultiLingual = () => this.getSupportedLanguages().length > 0;

  optionallyRenderContent = () => this.isExpanded() ? this.renderContent() : null;

  optionallyRenderFooter = () => this.isExpanded() && this.isFooterVisible() ? this.renderFooter() : null;

  getControlIcon = () => this.isExpanded() ? 'expand_more' : 'expand_less';

  selectTab = (event) => selectTab(this.getClassName(), event.target.getAttribute('data-id'));

  getSupportedActiveTabId = () => this.state.activeTabId &&
    this.getSupportedLanguages().includes(this.state.activeTabId) ? this.state.activeTabId : null;

  getFirstAvailableTabId = () => this.getSupportedLanguages().length > 0 && this.getSupportedLanguages()[0];

  getActiveTabId = () => this.getSupportedActiveTabId() ||
    this.getFirstAvailableTabId() || 'fi';

  isTabActive = (language) =>  language === this.getActiveTabId();

  getTabClassNames = (language) => classNames('language-tab', this.isTabActive(language) ? 'active-tab' : null);

  renderLanguageTabs = () => this.getSupportedLanguages()
    .map(language => <li key={language} className={this.getTabClassNames(language)} data-id={language}
                         onClick={this.selectTab}>{LANGUAGE_CODE_TO_TAB_NAME[language]}</li>);

  renderLanguageBar = () => this.isMultiLingual() && this.isExpanded() ? (
    <ul className={'language-tabs'}>
      {this.renderLanguageTabs()}
    </ul>
  ) : null;

  toggleState = () => {
    const newState = !this.isExpanded();
    const className = this.getClassName();
    setSectionExpansion(className, newState);
  }

  setSectionDone = () => setSectionDone(this.getClassName());

  getSupportedLanguages = () => this.state.supportedLanguages || [];

  renderHeader = () => (
      <div className={classNames("header", this.getHeaderCssClass())}>
        <div className={classNames("title")}>{this.getNumberedHeader()}</div>
        {this.renderLanguageBar()}
        <div className={classNames("controller", this.getControllerCssClass())} onClick={this.toggleState}>
          <i className="material-icons">{this.getControlIcon()}</i>
        </div>
      </div>
  )

  getClearButtonText = () => 'Tyhjennä';

  getSubmitButtonText = () => 'Jatka';

  handleSubmitButtonClick = () => {
    this.onSubmitButtonClick();
    broadcast(APP_EVENT_SECTION_VALIDATION_REQUEST, this.getClassName())
  }

  handleClearButtonClick = () => {
    this.onClearButtonClick();
    broadcast(APP_EVENT_SECTION_VALIDATION_REQUEST, this.getClassName());
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
      <div className={classNames('section', this.getCssClassName(), this.getExpansionStateCssClass())}>
        {this.renderHeader()}
        {this.optionallyRenderContent()}
        {this.optionallyRenderFooter()}
      </div>
  )
}
