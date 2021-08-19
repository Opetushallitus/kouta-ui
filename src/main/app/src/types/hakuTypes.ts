import { HAKULOMAKETYYPPI, JULKAISUTILA } from '#/src/constants';

import { AjankohtaFields } from './formTypes';

export type HakuModel = any;

export type HakulomakeFormSection = {
  tyyppi: HAKULOMAKETYYPPI;
  lomake: { value?: string };
  linkki?: TranslatedField<string>;
  kuvaus?: TranslatedField<string>;
};

export type HakuFormValues = {
  organisaatioOid?: SelectOption;
  externalId?: string;
  muokkaaja: string;
  tila: JULKAISUTILA;
  nimi: TranslatedField<string>;
  kieliversiot: Array<LanguageCode>;
  aikataulut: AjankohtaFields & {
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
