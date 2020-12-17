import { EditorState } from '#/src/components/Editor/Editor';
import {
  JULKAISUTILA,
  Ajankohtatyyppi,
  KOULUTUSTYYPPI,
  HAKULOMAKETYYPPI,
  Hakeutumistapa,
} from '#/src/constants';

export type ToteutusModel = any;

type Kuvaus = TranslatedField<any>;

type SelectOption = { label?: string; value: string };

type MaksullisuusTyyppi = 'kylla' | 'ei' | 'lukuvuosimaksu';

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

// TODO: Improve toteutus form types
export type ToteutusFormValues = {
  koulutustyyppi: KOULUTUSTYYPPI;
  muokkaaja?: string;
  tila: JULKAISUTILA;
  tiedot: {
    nimi: TranslatedField<string>;
    laajuus: string;
    laajuusyksikko?: SelectOption;
    ilmoittautumislinkki: TranslatedField<string>;
    aloituspaikat: string;
  };
  kuvaus: TranslatedField<typeof EditorState>;
  kieliversiot: Array<LanguageCode>;
  tarjoajat: Array<string>;
  jarjestamistiedot: {
    maksullisuus: {
      tyyppi: MaksullisuusTyyppi;
      maksu: string;
    };
    maksumaara: any;
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
    maksullisuusKuvaus: Kuvaus;
    osiot: Array<{ value: string }>;
    osioKuvaukset: Record<string, any>;
    onkoStipendia: 'kylla' | 'ei';
    stipendinMaara: number;
    stipendinKuvaus: Kuvaus;
    diplomiTyypit: Array<SelectOption | undefined>;
    diplomiKuvaus: Kuvaus;
    A1A2Kielet: Array<SelectOption | undefined>;
    aidinkielet: Array<SelectOption | undefined>;
    B1Kielet: Array<SelectOption | undefined>;
    B2Kielet: Array<SelectOption | undefined>;
    B3Kielet: Array<SelectOption | undefined>;
    muutKielet: Array<SelectOption | undefined>;
    ajankohta: {
      ajankohtaTyyppi: Ajankohtatyyppi;
      kausi?: string;
      vuosi?: SelectOption;
      tiedossaTarkkaAjankohta?: boolean;
      tarkkaAlkaa?: string;
      tarkkaPaattyy?: string;
      henkilokohtaisenSuunnitelmanLisatiedot?: TranslatedField<
        typeof EditorState
      >;
    };
  };
  nayttamistiedot: {
    ammattinimikkeet: TranslatedField<Array<SelectOption>>;
    avainsanat: TranslatedField<Array<SelectOption>>;
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
    lukiolinja?: { value: string };
  };
  toteutusjaksot: Array<Toteutusjakso>;
  teemakuva?: string;
  hakeutumisTaiIlmoittautumistapa: {
    hakeutumisTaiIlmoittautumistapa: HAKULOMAKETYYPPI.MUU;
    hakuTapa?: Hakeutumistapa;
    linkki?: string;
    lisatiedot?: TranslatedField<typeof EditorState>;
    lisatiedotValintaperusteista?: TranslatedField<typeof EditorState>;
    hakuaikaAlkaa?: string;
    hakuaikaPaattyy?: string;
  };
  soraKuvaus?: SelectOption;
};
