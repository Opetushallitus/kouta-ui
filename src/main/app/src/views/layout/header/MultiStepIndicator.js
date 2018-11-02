import React, {Component} from 'react';

import {withRouter} from 'react-router-dom'
import {
  workflowUrlHaku, workflowUrlHakukohde, workflowUrlKoulutus, workflowUrlToteutus, workflowUrlValintaperusteet
} from '../../../config/urls';
import {selectWorkflow} from '../../../stores/generic/WorkflowStore';

const classNames = require('classnames');

class StepperCircle extends Component {

  onClick = () => this.props.onClick(this.props.workflowUrl);

  getCssClassActive = () => window.location.href.endsWith(this.props.workflowUrl) ? 'active' : 'inactive';

  render = () => (
      <div className={"stepper-circle"} onClick={this.onClick}>
      <div className={classNames("circle", this.getCssClassActive())}>{this.props.title}</div>
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
          <StepperCircle workflowUrl={workflowUrlKoulutus()} ready={true} title={"1"} description={"Koulutus"} onClick={this.navigateToWorkflow}/>
          <StepperCircle workflowUrl={workflowUrlToteutus()} ready={false} title={"2"} description={"Toteutus"} onClick={this.navigateToWorkflow}/>
          <StepperCircle workflowUrl={workflowUrlHaku()} ready={false} title={"3"} description={"Haku"} onClick={this.navigateToWorkflow}/>
          <StepperCircle workflowUrl={workflowUrlHakukohde()} ready={false} title={"4"} description={"Hakukohde"} onClick={this.navigateToWorkflow}/>
          <StepperCircle workflowUrl={workflowUrlValintaperusteet()} ready={false} title={"5"} description={"Valintaperusteet"} onClick={this.navigateToWorkflow}/>
        </div>
      </div>
  )
}

export default withRouter(MultiStepIndicator);
