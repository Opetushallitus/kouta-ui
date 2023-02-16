type LanguageCode = 'fi' | 'sv' | 'en';

type FormDate = string;

type FormDateRange = { alkaa: FormDate; paattyy: FormDate };

type TranslatedField<T = string> = Partial<Record<LanguageCode, T>>;

type Koodi = {
  koodiUri: string;
  versio: number;
  metadata: any;
};

type Yhteystieto = {
  nimi: TranslatedField<string>;
  titteli: TranslatedField<string>;
  puhelinnumero: TranslatedField<string>;
  sahkoposti: TranslatedField<string>;
  verkkosivu: TranslatedField<string>;
  verkkosivuTeksti: TranslatedField<string>;
};

type SelectOption<T = string | undefined> = { label?: string; value: T };

type SelectOptions = Array<SelectOption<string>>;

type PohjaValinta = { tapa: string; valinta: string };

type ValueOf<T> = T[keyof T];

type Organisaatio = {
  oid: string;
  parentOidPath: string;
  nimi: TranslatedField;
  organisaatiotyypit: Array<string>;
  tyypit: Array<string>;
  children: Array<Organisaatio>;
  oppilaitostyyppi?: string;
};
