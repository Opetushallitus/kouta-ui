export class Koulutuskoodi {

  constructor(data, language) {
    this.data = data;
    this.language = language;
    this.id = this.getKoodiUri() + '-' + this.getVersio();
  }

  getId = () => this.id;

  getNimi = () => this.findLocalizedMetadataEntries()[0].nimi;

  findLocalizedMetadataEntries = () => this.data.metadata.filter((entry) => entry.kieli === this.language);

  getSelectionOptions = () => this.findLocalizedMetadataEntries().map((entry) => ({
    label: entry.nimi,
    id: this.getId(),
    comparisonValue: entry.nimi.toLowerCase()
  }));

  getKoodiUri = () => this.data.koodiUri;

  getVersio = () => this.data.versio;

};
