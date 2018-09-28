import React, {Component} from 'react';

export class StatusBar extends Component {

  render = () => (
    <div className={"status-bar"}>
      <h1 className={"header"}>Julkaise koulutus</h1>
      <div className={"status-box progress-box"}>
        <div className={"icon"}>
          <i className="far fa-star"/>
        </div>
        <div className={"info"}>
          <div className={"status-text"}>Tila: Kesken</div>
          <div className={"link-text"}>Vaihda tila</div>
        </div>
      </div>
      <div className={"status-box history-box"}>
        <div className={"icon fas fa-info"}/>
        <div className={"info"}>
          <div className={"status-text"}>Muokattu viimeksi:</div>
          <div className={"status-text"}>10.09.2018 9:15 Matti Meikäläinen</div>
          <span className={"link-text"}>Näytä versiohistoria</span>
        </div>
      </div>
    </div>
  )
}