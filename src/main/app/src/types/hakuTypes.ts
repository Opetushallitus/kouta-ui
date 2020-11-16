import { TOTEUTUKSEN_AJANKOHTA, HAKULOMAKETYYPPI } from '#/src/constants';

type HakulomakeFormSection = {
  tyyppi: HAKULOMAKETYYPPI;
  lomake: { value?: string };
  linkki?: TranslatedField<string>;
  kuvaus?: TranslatedField<string>;
};

type Yhteystieto = {
  nimi: TranslatedField<string>;
  titteli: TranslatedField<string>;
  puhelinnumero: TranslatedField<string>;
  sahkoposti: TranslatedField<string>;
  verkkosivu: TranslatedField<string>;
};

export type HakuFormValues = {
  muokkaaja: string;
  tila: string;
  nimi: TranslatedField<string>;
  kieliversiot: Array<LanguageCode>;
  aikataulut: {
    toteutuksenAjankohta: TOTEUTUKSEN_AJANKOHTA;
    kausi: string;
    vuosi: { value?: string };
    tiedossaTarkkaAjankohta: boolean;
    tarkkaAlkaa: string;
    tarkkaPaattyy: string;
    hakuaika: Array<FormDateRange>;
    aikataulu: Array<FormDateRange>;
    lisaamisenTakaraja: FormDate;
    muokkauksenTakaraja: FormDate;
    ajastettuJulkaisu: FormDate;
  };
  hakutapa: string;
  kohdejoukko: {
    kohdejoukko: string;
    tarkenne: { value: string } | null;
  };
  hakulomake: HakulomakeFormSection;
  yhteyshenkilot: Array<Yhteystieto>;
};
