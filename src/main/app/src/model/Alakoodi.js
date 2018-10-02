export const KOODISTO_URI_KOULUTUSALA = 'okmohjauksenala'; //Terveys- ja hyvinvointialat
const KOODISTO_URI_OSAAMISALA = 'osaamisala';
const KOODISTO_URI_TUTKINTONIMIKKEET = 'tutkintonimikkeet';
const KOODISTO_URI_OPINTOJEN_LAAJUUS = 'opintojenlaajuus';
const KOODISTO_URI_OPINTOJEN_LAAJUUSYKSIKKO = 'opintojenlaajuusyksikko';


const AlakoodiFinder = {
  findMany: (alakoodiList, alakoodiType) =>  alakoodiList.filter((item) => item.isOfType(alakoodiType)),
  findOne: (alakoodiList, alakoodiType) =>  alakoodiList.find((item) => item.isOfType(alakoodiType)),
  findName: (alakoodiList, alakoodiType, language) => AlakoodiFinder.findOne(alakoodiList, alakoodiType).findName(language),
  findNames: (alakoodiList, alakoodiType, language) => AlakoodiFinder.findMany(alakoodiList, alakoodiType).map((item) => item.findName())
};

export const AlakoodiList = {
  createFromJsonArray: (jsonArray) => jsonArray.map(AlakoodiItem.createFromJson),
  findKoulutusala: (alakoodiList, language) => AlakoodiFinder.findName(alakoodiList, KOODISTO_URI_KOULUTUSALA, language),
  findOsaamisalaList: (alakoodiList, language) => AlakoodiFinder.findNames(alakoodiList, KOODISTO_URI_OSAAMISALA, language),
  findTutkintonimikeList: (alakoodiList, language) => AlakoodiFinder.findNames(alakoodiList, KOODISTO_URI_TUTKINTONIMIKKEET, language),
  findOpintojenLaajuus: (alakoodiList, language) => AlakoodiFinder.findName((alakoodiList), KOODISTO_URI_OPINTOJEN_LAAJUUS, language),
  findOpintojenLaajuusyksikko: (alakoodiList, language) => AlakoodiFinder.findName((alakoodiList), KOODISTO_URI_OPINTOJEN_LAAJUUSYKSIKKO, language)
};


export class AlakoodiItem {

  static createFromJson = (json) => new AlakoodiItem(json);

  constructor(json){
    this.data = json;
    this.findLocalizedMetadata = this.findLocalizedMetadata.bind(this);
    this.findName = this.findName.bind(this);
  }

  get koodistoUri() {
    return this.data.koodisto.koodistoUri;
  }

  get metadata() {
    return this.data.metadata;
  }

  isOfType = (koodistoUriType) =>  this.koodistoUri === koodistoUriType;

  isKoulutusala = () => this.koodistoUri === KOODISTO_URI_KOULUTUSALA;

  isOsaamisala = () => this.koodistoUri === KOODISTO_URI_OSAAMISALA;

  isTutkintonimike = () => this.koodistoUri === KOODISTO_URI_TUTKINTONIMIKKEET;

  isOpintojenLaajuus = () => this.koodistoUri === KOODISTO_URI_OPINTOJEN_LAAJUUS;

  isOpintojenLaajuusyksikko = () => this.koodistoUri === KOODISTO_URI_OPINTOJEN_LAAJUUSYKSIKKO;

  findLocalizedMetadata(language) {
    return this.metadata.find((entry) => entry.kieli === language);
  }

  findName(language) {
    return this.findLocalizedMetadata(language).nimi;
  }


};

