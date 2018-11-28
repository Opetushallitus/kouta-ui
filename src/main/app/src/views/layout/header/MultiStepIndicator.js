import React, {Component} from 'react';

import {withRouter} from 'react-router-dom';
import {
  workflowUrlHaku,
  workflowUrlHakukohde,
  workflowUrlKoulutus,
  workflowUrlToteutus,
  workflowUrlValintaperusteet
} from '../../../config/urls';
import {selectWorkflow} from '../../../stores/generic/WorkflowStore';

const classNames = require('classnames');

class StepperCircle extends Component {

  onClick = () => this.props.onClick(this.props.workflowUrl);

  getCssClassActive = () => window.location.href.endsWith(this.props.workflowUrl) ? 'active' : 'inactive';

  render = () => (
    <div className={"stepper-circle"} onClick={this.onClick}>
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
        <StepperCircle workflowUrl={workflowUrlKoulutus()} ready={true} description={"Koulutus"}
          onClick={this.navigateToWorkflow} icon={'school'}/>
        <StepperCircle workflowUrl={workflowUrlToteutus()} ready={false} description={"Toteutus"}
          onClick={this.navigateToWorkflow} icon={'settings'}/>
        <StepperCircle workflowUrl={workflowUrlHaku()} ready={false} description={"Haku"}
          onClick={this.navigateToWorkflow} icon={'schedule'}/>
        <StepperCircle workflowUrl={workflowUrlHakukohde()} ready={false} description={"Hakukohde"}
          onClick={this.navigateToWorkflow} icon={'grain'}/>
        <StepperCircle workflowUrl={workflowUrlValintaperusteet()} ready={false}
          description={"Valintaperusteet"} onClick={this.navigateToWorkflow} icon={'select_all'}/>
      </div>
    </div>
  )
}

export default withRouter(MultiStepIndicator);
