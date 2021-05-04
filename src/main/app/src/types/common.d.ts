type LanguageCode = 'fi' | 'sv' | 'en';

type FormDate = string;

type FormDateRange = { alkaa: FormDate; paattyy: FormDate };

type TranslatedField<T> = Partial<Record<LanguageCode, T>>;

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
};

type SoraKuvausModel = any;

type SelectOption<T = string | undefined> = { label?: string; value: T };

type SelectOptions = Array<SelectOption<string>>;

type PohjaValinta = { tapa: string; valinta: string };
