type LanguageCode = 'fi' | 'sv' | 'en';

type FormDate = string;

type FormDateRange = { alkaa: FormDate; paattyy: FormDate };

type TranslatedField<T> = Partial<Record<LanguageCode, T>>;

type HakulomakeTyyppi = 'ataru' | 'haku-app' | 'muu' | 'ei sähköistä';

type HakulomakeFormSection = {
  tyyppi: HakulomakeTyyppi;
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

type HakuFormValues = {
  tila: string;
  nimi: TranslatedField<string>;
  kieliversiot: Array<LanguageCode>;
  aikataulut: {
    toteutuksenAjankohta: ALKAMISKAUSITYYPPI;
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
