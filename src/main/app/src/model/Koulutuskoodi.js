import {AlakoodiList, KOODISTO_URI_KOULUTUSALA} from './Alakoodi';

export class Koulutuskoodi {

  constructor(data, language) {
    this.data = data;
    this.language = language;
  }

  getId = () =>   this.getKoodiUri() + '-' + this.getVersio();

  findLocalizedMetadataEntries = () => this.data.metadata.filter((entry) => entry.kieli === this.language);

  getSelectionOptions = () => this.findLocalizedMetadataEntries().map((entry) => ({
    label: entry.nimi,
    id: this.getId(),
    comparisonValue: entry.nimi.toLowerCase()
  }));

  getKoodiUri = () => this.data.koodiUri;

  getVersio = () => this.data.versio;

  configureKoulutusDetails = (alakoodiJsonArray) => {
    const alakoodiList = AlakoodiList.createFromJsonArray(alakoodiJsonArray);
    this.osaamisalaList = AlakoodiList.findOsaamisalaList(alakoodiList, this.language);
    this.koulutusala = AlakoodiList.findKoulutusala(alakoodiList, this.language);
    this.opintojenLaajuus = AlakoodiList.findOpintojenLaajuus(alakoodiList, this.language);
    this.opintojenLaajuusyksikko = AlakoodiList.findOpintojenLaajuusyksikko(alakoodiList, this.language);
  };


};
