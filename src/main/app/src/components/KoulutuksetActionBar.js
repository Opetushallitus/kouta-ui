import React, {Component} from 'react';

class KoulutuksetActionBar extends Component {
    render = () =>  (
        <div className={"koulutukset-action-bar"}>
            <h1 className={"koulutukset-header"}>Koulutukset</h1>
            <button className={"new-koulutus-button"}>Luo uusi koulutus</button>
            <button className={"file-import-button"}>Tuo tiedostosta</button>
        </div>
    )
}

export default KoulutuksetActionBar;