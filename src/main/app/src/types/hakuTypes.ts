import {
  Ajankohtatyyppi,
  HAKULOMAKETYYPPI,
  JULKAISUTILA,
} from '#/src/constants';
import { EditorState } from '#/src/components/Editor/Editor';

export type HakuModel = any;

export type HakulomakeFormSection = {
  tyyppi: HAKULOMAKETYYPPI;
  lomake: { value?: string };
  linkki?: TranslatedField<string>;
  kuvaus?: TranslatedField<string>;
};

export type HakuFormValues = {
  muokkaaja: string;
  tila: JULKAISUTILA;
  nimi: TranslatedField<string>;
  kieliversiot: Array<LanguageCode>;
  aikataulut: {
    ajankohtaTyyppi: Ajankohtatyyppi;
    kausi?: string;
    vuosi?: { value: string };
    tiedossaTarkkaAjankohta: boolean;
    tarkkaAlkaa?: string;
    tarkkaPaattyy?: string;
    hakuaika: Array<FormDateRange>;
    aikataulu: Array<FormDateRange>;
    lisaamisenTakaraja: FormDate;
    muokkauksenTakaraja: FormDate;
    ajastettuJulkaisu: FormDate;
    henkilokohtaisenSuunnitelmanLisatiedot?: TranslatedField<
      typeof EditorState
    >;
  };
  hakutapa: string;
  kohdejoukko: {
    kohdejoukko: string;
    tarkenne: { value: string } | null;
  };
  hakulomake: HakulomakeFormSection;
  yhteyshenkilot: Array<Yhteystieto>;
};
