import React, {Component} from 'react';

export class AbstractSection extends Component {


  getHeader = () => {
    throw new Error("AbstractSection:getHeader: implement in subclass!")
  }


  renderHeader = () => (
    <div className={"header"}>
      <div className={"title"}>{this.getHeader()}</div>
      <div className={"controller"}>
        <i class="fas fa-sort-down"></i>
      </div>
    </div>
  )

  renderContent = () => null;

  render = () => (
      <div className={"section"}>
        {this.renderHeader()}
        {this.renderContent()}
      </div>
  )

}