import {AlakoodiList, KOODISTO_URI_KOULUTUSALA} from './Alakoodi';

export class Koulutuskoodi {

  constructor(data, language) {
    this.data = data;
    this.language = language;
  }

  getId = () =>   this.getKoodiUri() + '-' + this.getVersio();

  getNimi = () => this.findLocalizedMetadataEntry().nimi;

  findLocalizedMetadataEntry = () => this.data.metadata.find((entry) => entry.kieli === this.language);

  getSelectionOptions = () => this.findLocalizedMetadataEntries().map((entry) => ({
    label: entry.nimi,
    id: this.getId(),
    comparisonValue: entry.nimi.toLowerCase()
  }));

  getKoodiUri = () => this.data.koodiUri;

  getVersio = () => this.data.versio;

};
