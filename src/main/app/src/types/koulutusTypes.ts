import { EditorState } from '#/src/components/Editor/Editor';
import { JULKAISUTILA, KOULUTUSTYYPPI } from '#/src/constants';

export type KoulutusModel = any;

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
  opintojenLaajuus: SelectOption;
  tutkintonimike: SelectOptions;
  koulutusalat: SelectOptions;
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
    nimi: TranslatedField<string>;
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
