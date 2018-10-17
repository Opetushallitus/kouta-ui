import React, {Component} from 'react';
const classNames = require('classnames');

class StepperCircle extends Component {
  render = () => (
    <div className={"stepper-circle"}>
      <div className={classNames("circle", this.props.ready? "ready" : "pending")}>{this.props.title}</div>
      <div className={"description"}>{this.props.description}</div>
    </div>
  )
}

export class MultiStepIndicator extends Component {

  render = () => (
      <div className={"multi-step-indicator"}>
        <div className={"circle-container"}>
          <StepperCircle ready={true} title={"1"} description={"Koulutus"}/>
          <StepperCircle ready={false} title={"2"} description={"Toteutus"}/>
          <StepperCircle ready={false} title={"3"} description={"Haku"}/>
          <StepperCircle ready={false} title={"4"} description={"Haku 2"}/>
          <StepperCircle ready={false} title={"5"} description={"Julkaisu"}/>
        </div>
      </div>
  )
}