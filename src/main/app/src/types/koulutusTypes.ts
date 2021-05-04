import { EditorState } from '#/src/components/Editor/Editor';
import { JULKAISUTILA, KOULUTUSTYYPPI } from '#/src/constants';

export type KoulutusModel = any;

export type KoulutusFormValues = {
  koulutustyyppi: KOULUTUSTYYPPI;
  kieliversiot: Array<LanguageCode>;
  muokkaaja?: string;
  tila: JULKAISUTILA;
  information: {
    nimi: TranslatedField<string>;
    eperuste: SelectOption;
    koulutus: SelectOption;
    korkeakoulutukset: Array<SelectOption>;
    opintojenLaajuus: SelectOption;
    tutkintonimike: Array<SelectOption>;
    koulutusalat: Array<SelectOption>;
  };
  lisatiedot: {
    osiot: Array<{ value: string }>;
    osioKuvaukset: Record<string, any>;
  };
  tutkinnonosat: {
    nimi: TranslatedField<string>;
    osat: Array<{
      koulutus: SelectOption;
      eperuste: SelectOption;
      osat: Array<{ value: string; viite: string }>;
    }>;
  };
  description: {
    kuvaus: TranslatedField<EditorState>;
    nimi: TranslatedField<string>;
  };
  tarjoajat: { tarjoajat: Array<string>; kaytaPohjanJarjestajaa: boolean };
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
