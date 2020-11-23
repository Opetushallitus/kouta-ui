type LanguageCode = 'fi' | 'sv' | 'en';

type FormDate = string;

type FormDateRange = { alkaa: FormDate; paattyy: FormDate };

type TranslatedField<T> = Partial<Record<LanguageCode, T>>;

type SelectOptions = Array<{ value: string; label: string }>;

type Koodi = {
  koodiUri: string;
  versio: number;
  metadata: any;
};
