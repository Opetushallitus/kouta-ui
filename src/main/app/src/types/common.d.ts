type LanguageCode = 'fi' | 'sv' | 'en';

type FormDate = string;

type FormDateRange = { alkaa: FormDate; paattyy: FormDate };

type TranslatedField<T = string> = Partial<Record<LanguageCode, T>>;

type KoodiMetadata = {
  nimi: string;
  kieli: 'FI' | 'SV' | 'EN';
};

type Koodi = {
  koodiUri: string;
  versio: number;
  koodiArvo: string;
  metadata: Array<KoodiMetadata>;
  koodisto: {
    koodistoUri: string;
  };
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

type Serializable =
  | Partial<{
      [x: string]: Serializable;
    }>
  | number
  | string
  | null
  | boolean
  | Array<Serializable>;

type NullableUndef<T> = undefined extends T ? T | null : T;

type WithNullableUndefs<F extends Record<string, Serializable>> = {
  [P in keyof F]: NullableUndef<WithNullableUndefs<F[P]>>;
};
