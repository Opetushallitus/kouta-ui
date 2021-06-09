import { EditorState } from '#/src/components/Editor/Editor';
import {
  JULKAISUTILA,
  KOULUTUSTYYPPI,
  HAKULOMAKETYYPPI,
  Hakeutumistapa,
  ApurahaMaaraTyyppi,
  ApurahaYksikko,
} from '#/src/constants';

import { AjankohtaFields } from './formTypes';

export type ToteutusModel = any;

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
  sisalto: Array<{
    tyyppi: string;
    data: any;
  }>;
};

type LukiolinjatOsio = {
  kaytossa: boolean;
  valinnat: SelectOptions;
  kuvaukset: Array<TranslatedField<EditorState>>;
};

type Kielivalikoima = {
  A1A2Kielet: SelectOptions;
  aidinkielet: SelectOptions;
  B1Kielet: SelectOptions;
  B2Kielet: SelectOptions;
  B3Kielet: SelectOptions;
  muutKielet: SelectOptions;
};

// TODO: Improve toteutus form types
export type ToteutusFormValues = {
  koulutustyyppi: KOULUTUSTYYPPI;
  muokkaaja?: string;
  tila: JULKAISUTILA;
  tiedot: {
    nimi: TranslatedField<string>;
    ammatillinenPerustutkintoErityisopetuksena: boolean;
    laajuus: string;
    laajuusyksikko?: SelectOption;
    ilmoittautumislinkki: TranslatedField<string>;
    aloituspaikat: string;
  };
  kuvaus: TranslatedField<EditorState>;
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
    apurahaMaaraTyyppi?: ApurahaMaaraTyyppi;
    apurahaMin?: number;
    apurahaMax?: number;
    apurahaKuvaus?: Kuvaus;
    apurahaYksikko?: SelectOption<ApurahaYksikko>;
    diplomiTyypit: SelectOptions;
    diplomiKuvaus: Kuvaus;
    kielivalikoima: Kielivalikoima;
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
  ylemmanKorkeakoulututkinnonOsaamisalat: Array<any>;
  alemmanKorkeakoulututkinnonOsaamisalat: Array<any>;
  lukiolinjat: {
    painotukset: LukiolinjatOsio;
    erityisetKoulutustehtavat: LukiolinjatOsio;
  };
  toteutusjaksot: Array<Toteutusjakso>;
  teemakuva?: string;
  hakeutumisTaiIlmoittautumistapa: {
    hakeutumisTaiIlmoittautumistapa: HAKULOMAKETYYPPI.MUU;
    hakuTapa?: Hakeutumistapa;
    linkki?: string;
    lisatiedot?: TranslatedField<EditorState>;
    lisatiedotValintaperusteista?: TranslatedField<EditorState>;
    hakuaikaAlkaa?: string;
    hakuaikaPaattyy?: string;
  };
  soraKuvaus?: SelectOption;
  esikatselu?: boolean;
};
