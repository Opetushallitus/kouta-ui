import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import axios from 'axios';
import {urls} from 'oph-urls-js';
import {updateState} from "../../../utils/stateUtils";
import {
    APP_EVENT_AMMATTINIMIKE_DELETE,
    APP_EVENT_AMMATTINIMIKE_INSERT,
    APP_EVENT_ASIASANA_DELETE,
    APP_EVENT_ASIASANA_INSERT,
    listAmmattinimikkeet,
    listAsiasanat
} from "../../../stores/toteutus/ToteutusStore";
import {KeywordSelector} from "../../../components/KeywordSelector";

export class ToteutuksenNayttamistiedotSection extends AbstractSection {

  onMount = () => {};

  getClassName = () => 'ToteutuksenNayttamistiedotSection';

  getHeader = () => 'Koulutuksen näyttämiseen liittyvät tiedot';

  findAmmattinimikkeet = (value, onSuccess) =>
    axios.get(urls.url('kouta-backend.ammattinimike-search', value, 'fi', 10)).then(r =>
        onSuccess(r.data)
    ).catch(r => console.log("TODO: error handle"));

  findAsiasanat = (value, onSuccess) =>
    axios.get(urls.url('kouta-backend.asiasana-search', value, 'fi', 10)).then(r =>
        onSuccess(r.data)
    ).catch(r => console.log("TODO: error handle"));

  addAmmattinimike = (ammattinimike) => updateState(APP_EVENT_AMMATTINIMIKE_INSERT, ammattinimike);

  deleteAmmattinimike = (ammattinimike) => updateState(APP_EVENT_AMMATTINIMIKE_DELETE, ammattinimike);

  addAsiasana = (asiasana) => updateState(APP_EVENT_ASIASANA_INSERT, asiasana);

  deleteAsiasana = (asiasana) => updateState(APP_EVENT_ASIASANA_DELETE, asiasana);

  renderContent = () => (
    <div className={'content'}>
        <KeywordSelector header="Ammattinimike"
                         info="Lisää ammattinimike (Max 5 kpl)"
                         searchKeywords={this.findAmmattinimikkeet}
                         listKeywords={listAmmattinimikkeet}
                         addKeyword={this.addAmmattinimike}
                         deleteKeyword={this.deleteAmmattinimike}/>
        <KeywordSelector header="Asiasana"
                         info="Lisää asiasana (Max 5 kpl)"
                         searchKeywords={this.findAsiasanat}
                         listKeywords={listAsiasanat}
                         addKeyword={this.addAsiasana}
                         deleteKeyword={this.deleteAsiasana}/>
    </div>
  );
}
