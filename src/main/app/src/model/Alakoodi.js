const KOODISTO_URI_KOULUTUSALA = 'okmohjauksenala';
const KOODISTO_URI_OSAAMISALA = 'osaamisala';
const KOODISTO_URI_TUTKINTONIMIKKEET = 'tutkintonimikkeet';
const KOODISTO_URI_OPINTOJEN_LAAJUUS = 'opintojenlaajuus';
const KOODISTO_URI_OPINTOJEN_LAAJUUSYKSIKKO = 'opintojenlaajuusyksikko';

const AlakoodiFinder = {
  findMany: (alakoodiList, alakoodiType) =>  alakoodiList.filter((item) => item.isOfType(alakoodiType)),
  findOne: (alakoodiList, alakoodiType) =>  alakoodiList.find((item) => item.isOfType(alakoodiType)),
  findName: (alakoodiList, alakoodiType, language) => AlakoodiItem.findName(AlakoodiFinder.findOne(alakoodiList, alakoodiType), language),
  findNames: (alakoodiList, alakoodiType, language) => AlakoodiFinder.findMany(alakoodiList, alakoodiType).map((item) => item.findName(language))
};

export const AlakoodiList = {
  createFromJsonArray: (jsonArray) => jsonArray.map(AlakoodiItem.createFromJson),
  findKoulutusala: (alakoodiList, language) => AlakoodiFinder.findName(alakoodiList, KOODISTO_URI_KOULUTUSALA, language),
  findOsaamisalaList: (alakoodiList, language) => AlakoodiFinder.findNames(alakoodiList, KOODISTO_URI_OSAAMISALA, language),
  findTutkintonimikeList: (alakoodiList, language) => AlakoodiFinder.findNames(alakoodiList, KOODISTO_URI_TUTKINTONIMIKKEET, language),
  findOpintojenLaajuus: (alakoodiList, language) => AlakoodiFinder.findName(alakoodiList, KOODISTO_URI_OPINTOJEN_LAAJUUS, language),
  findOpintojenLaajuusyksikko: (alakoodiList, language) => AlakoodiFinder.findName(alakoodiList, KOODISTO_URI_OPINTOJEN_LAAJUUSYKSIKKO, language)
};

export class AlakoodiItem {

  static createFromJson = (json) => new AlakoodiItem(json);

  static findName = (item, language) => item ? item.findName(language) : null;

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

  findLocalizedMetadata(language) {
    return this.metadata.find((entry) => entry.kieli === language);
  }

  findName(language) {
    return this.findLocalizedMetadata(language).nimi;
  }

  isOfType = (koodistoUriType) =>  this.koodistoUri === koodistoUriType;

};

