import React, {Component} from 'react';

import {withRouter} from 'react-router-dom';
import {selectWorkflow} from '../../../stores/generic/WorkflowStore';

const classNames = require('classnames');

class StepperCircle extends Component {

  onClick = () => this.props.onClick(this.props.workflowUrl);

  getCssClassActive = () => window.location.href.endsWith(this.props.workflowUrl) ? 'active' : 'inactive';

  render = () => (
    <div className={classNames("stepper-circle", this.props.nameClass)} onClick={this.onClick}>
      <div className={classNames("circle", this.getCssClassActive())}><i
        className={'material-icons'}>{this.props.icon}</i></div>
      <div className={"description"}>{this.props.description}</div>
    </div>
  )
}

export class MultiStepIndicator extends Component {

  navigateToWorkflow = (workflowUrl) => {
    selectWorkflow(workflowUrl);
    this.props.history.push(workflowUrl);
  }

  render = () => (
    <div className={"multi-step-indicator"}>
      <div className={"circle-container"}>
        <StepperCircle nameClass={'koulutus-circle'} workflowUrl={'/koulutus'} ready={true} description={"Koulutus"}
          onClick={this.navigateToWorkflow} icon={'school'}/>
        <StepperCircle nameClass={'toteutus-circle'} workflowUrl={'/toteutus'} ready={false} description={"Toteutus"}
          onClick={this.navigateToWorkflow} icon={'settings'}/>
        <StepperCircle nameClass={'haku-circle'} workflowUrl={'/haku'} ready={false} description={"Haku"}
          onClick={this.navigateToWorkflow} icon={'schedule'}/>
        <StepperCircle nameClass={'hakukohde-circle'} workflowUrl={'/hakukohde'} ready={false} description={"Hakukohde"}
          onClick={this.navigateToWorkflow} icon={'grain'}/>
        <StepperCircle nameClass={'valintaperusteet-circle'} workflowUrl={'/valintaperusteet'} ready={false}
          description={"Valintaperusteet"} onClick={this.navigateToWorkflow} icon={'select_all'}/>
      </div>
    </div>
  )
}

export default withRouter(MultiStepIndicator);
