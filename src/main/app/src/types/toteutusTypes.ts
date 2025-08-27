import { EditorState } from 'lexical';

import {
  JULKAISUTILA,
  KOULUTUSTYYPPI,
  HAKULOMAKETYYPPI,
  Hakeutumistapa,
  MaaraTyyppi,
  ApurahaYksikko,
} from '#/src/constants';

import { AjankohtaFields, SisaltoValues } from './formTypes';

type Kuvaus = TranslatedField<any>;

export enum MaksullisuusTyyppi {
  MAKSULLINEN = 'maksullinen',
  MAKSUTON = 'maksuton',
  LUKUVUOSIMAKSU = 'lukuvuosimaksu',
}

type Toteutusjakso = {
  nimi: TranslatedField<string>;
  koodi: string;
  laajuus: TranslatedField<string>;
  ilmoittautumislinkki: TranslatedField<string>;
  kuvaus: Kuvaus;
  sisalto: SisaltoValues;
};

export type LukiolinjatOsio = {
  kaytossa: boolean;
  valinnat: SelectOptions;
  kuvaukset: Record<string, TranslatedField<EditorState>>;
};

type Kielivalikoima = {
  A1Kielet: SelectOptions;
  A2Kielet: SelectOptions;
  aidinkielet: SelectOptions;
  B1Kielet: SelectOptions;
  B2Kielet: SelectOptions;
  B3Kielet: SelectOptions;
  muutKielet: SelectOptions;
};

export type LukioDiplomiValues = {
  valinnat: Array<SelectOption>;
  linkit: Array<{
    url: TranslatedField<string>;
    alt: TranslatedField<string>;
  }>;
};

export type ToteutusFormValues = {
  organisaatioOid?: SelectOption;
  externalId?: string;
  koulutustyyppi: KOULUTUSTYYPPI;
  muokkaaja?: string;
  tila: JULKAISUTILA;
  tiedot: {
    nimi: TranslatedField<string>;
    ammatillinenPerustutkintoErityisopetuksena: boolean;
    jarjestetaanErityisopetuksena: boolean;
    opintojenLaajuusyksikko?: SelectOption;
    opintojenLaajuusNumero: string;
    opintojenLaajuusNumeroMin?: string;
    opintojenLaajuusNumeroMax?: string;
    laajuusNumeroTyyppi?: MaaraTyyppi;
    ilmoittautumislinkki: TranslatedField<string>;
    hasJotpaRahoitus: boolean;
    isTyovoimakoulutus: boolean;
    isTaydennyskoulutus: boolean;
    isAvoinKorkeakoulutus?: boolean;
    isPieniOsaamiskokonaisuus?: boolean;
    suoritetaanNayttona?: boolean;
    tunniste?: string;
    opinnonTyyppi?: SelectOption;
    taiteenalat?: SelectOptions;
  };
  opintojaksojenLiittaminen?: {
    opintojaksot: Array<{ opintojakso: SelectOption }>;
  };
  osaamismerkkienLiittaminen?: {
    osaamismerkit: Array<{ osaamismerkki: SelectOption }>;
  };
  kuvaus: TranslatedField<EditorState>;
  osaamistavoitteet: TranslatedField<EditorState>;
  kieliversiot: Array<LanguageCode>;
  tarjoajat: Array<string>;
  jarjestamistiedot: {
    maksullisuustyyppi: MaksullisuusTyyppi;
    maksunMaara: number;
    maksullisuusKuvaus: Kuvaus;
    opetustapa: Array<string>;
    opetustapaKuvaus: Kuvaus;
    opetusaika: Array<string>;
    opetusaikaKuvaus: Kuvaus;
    opetuskieli: Array<string>;
    opetuskieliKuvaus: Kuvaus;
    suunniteltuKesto: {
      vuotta: number;
      kuukautta: number;
    };
    suunniteltuKestoKuvaus: Kuvaus;
    osiot: Array<{ value: string }>;
    osioKuvaukset: Record<string, any>;
    onkoApuraha?: boolean;
    apurahaMaaraTyyppi?: MaaraTyyppi;
    apurahaMin?: number;
    apurahaMax?: number;
    apurahaKuvaus?: Kuvaus;
    apurahaYksikko?: SelectOption<ApurahaYksikko>;
    kielivalikoima: Kielivalikoima;
    diplomit: LukioDiplomiValues;
    ajankohta: AjankohtaFields;
  };
  nayttamistiedot: {
    ammattinimikkeet: TranslatedField<SelectOptions>;
    avainsanat: TranslatedField<SelectOptions>;
  };
  yhteyshenkilot: Array<Yhteystieto>;
  osaamisalat: {
    osaamisalat: Array<any>;
    osaamisalaLinkit: Record<string, TranslatedField<string>>;
    osaamisalaLinkkiOtsikot: Record<string, TranslatedField<string>>;
  };
  lukiolinjat: {
    yleislinja: boolean;
    painotukset: LukiolinjatOsio;
    erityisetKoulutustehtavat: LukiolinjatOsio;
  };
  toteutusjaksot: Array<Toteutusjakso>;
  teemakuva?: string;
  hakeutumisTaiIlmoittautumistapa: {
    isHakukohteetKaytossa?: boolean;
    hakeutumisTaiIlmoittautumistapa: HAKULOMAKETYYPPI.MUU;
    hakuTapa?: Hakeutumistapa;
    linkki?: TranslatedField;
    lisatiedot?: TranslatedField<EditorState>;
    lisatiedotValintaperusteista?: TranslatedField<EditorState>;
    hakuaikaAlkaa?: string;
    hakuaikaPaattyy?: string;
    aloituspaikat: string;
    aloituspaikkakuvaus: TranslatedField<EditorState>;
  };
  soraKuvaus?: SelectOption;
  esikatselu?: boolean;
  esitysnimi?: string;
};

export type ToteutusTiedotSectionProps = {
  name: string;
  language: LanguageCode;
  disabled?: boolean;
  koulutus: any;
  koulutustyyppi: KOULUTUSTYYPPI;
};
