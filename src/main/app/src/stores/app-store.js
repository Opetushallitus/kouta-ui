import { observable, action } from 'mobx';
import axios from 'axios';

class AppStore {
  @observable koulutustyyppiOptions = [
    {
      value: 'ammatillinen-koulutus',
      label: 'Ammatillinen koulutus'
    },
    {
      value: 'korkeakoulukoulutus',
      label: 'Korkeakoulukoulutus'
    },
    {
      value: 'lukiokoulutus',
      label: 'Lukiokoulutus'
    }
  ];

  @observable koulutustyyppiSectionExpanded = false;
  @observable koulutuksenTiedotSectionExpanded = false;
  @observable koulutustyyppi = null;
  @observable koodisto = null;

  @action
  setKoulutustyyppiSectionExpanded = (value) => this.koulutustyyppiSectionExpanded = value;

  @action
  setKoulutuksenTiedotSectionExpanded = (value) => this.koulutuksenTiedotSectionExpanded = value;

  @action
  setKoulutustyyppi = (koulutustyyppi) => this.koulutustyyppi = koulutustyyppi;

  @action
  findKoodisto = () =>
      axios.get(`https://virkailija.testiopintopolku.fi/koodisto-service/rest/json/koulutus/koodi?onlyValidKoodis=true`)
    .then((response) => this.koodisto = response.data);

  @action
  selectKoulutustyyppi = (value) => {
    this.setKoulutustyyppi(value);
    this.setKoulutuksenTiedotSectionExpanded(true);
    this.findKoodisto();
  };


}
export default AppStore;