import { EditorState } from 'lexical';

import { JULKAISUTILA, KOULUTUSTYYPPI, MaaraTyyppi } from '#/src/constants';

export type TutkinnonOsa = {
  koulutus: SelectOption;
  eperuste: SelectOption;
  osat: Array<{ value: string; viite: string }>;
};

export type InformationSectionValues = {
  nimi: TranslatedField<string>;
  eperuste?: SelectOption;
  koulutus: SelectOption;
  korkeakoulutukset: SelectOptions;
  opintojenLaajuusyksikko?: SelectOption;
  opintojenLaajuusNumero?: string;
  opintojenLaajuusNumeroMin?: string;
  opintojenLaajuusNumeroMax?: string;
  laajuusNumeroTyyppi?: MaaraTyyppi;
  tutkintonimike: SelectOptions;
  koulutusalat: SelectOptions;
  erikoistumiskoulutus?: SelectOption;
  luokittelutermit?: Array<SelectOption>;
  // Avoimen korkeakoulutuksen kentät:
  isAvoinKorkeakoulutus?: boolean;
  tunniste?: string;
  opinnonTyyppi?: SelectOption;
  osaamismerkki?: SelectOption;
};

export type KoulutusFormValues = {
  organisaatioOid?: SelectOption;
  externalId?: string;
  koulutustyyppi: KOULUTUSTYYPPI;
  kieliversiot: Array<LanguageCode>;
  muokkaaja?: string;
  tila: JULKAISUTILA;
  pohja?: PohjaValinta & { tarjoajat: Array<string> };
  information: InformationSectionValues;
  lisatiedot: {
    osiot: SelectOptions;
    osioKuvaukset: Record<string, any>;
  };
  tutkinnonosat: {
    nimi: TranslatedField<string>;
    osat: Array<TutkinnonOsa>;
  };
  description: {
    kuvaus: TranslatedField<EditorState>;
    osaamistavoitteet: TranslatedField<EditorState>;
    linkkiEPerusteisiin?: TranslatedField<string>;
  };
  tarjoajat: { tarjoajat: Array<string>; kaytaPohjanJarjestajaa?: boolean };
  julkinen?: boolean;
  teemakuva?: string;
  esikatselu?: boolean;
  osaamisala?: {
    osaamisala: SelectOption;
    eperuste: SelectOption;
    koulutus: SelectOption;
  } | null;
  soraKuvaus?: SelectOption | null;
};
