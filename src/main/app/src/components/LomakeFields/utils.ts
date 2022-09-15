import { useMemo } from 'react';

import { useUrls } from '#/src/contexts/UrlContext';
import { useHakemuspalveluLomakkeet } from '#/src/utils/api/getHakemuspalveluLomakkeet';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

export const useAtaruLomakeUrl = option => {
  const apiUrls = useUrls();
  return (
    option?.value && apiUrls.url('lomake-editori.muokkaus-sivu', option.value)
  );
};

const filterOutOnlyYhteishakuForms = (hakutapa: string) => {
  const noYhteishakuForms = !(isYhteishakuHakutapa(hakutapa));
  return (form: any) => !noYhteishakuForms || form?.properties['allow-only-yhteishaut'] !== true
}

export const useLomakeOptions = ({ language, hakutapa }) => {
  const { data: ataruLomakkeet = [] } = useHakemuspalveluLomakkeet();

  return useMemo(
    () =>
      ataruLomakkeet
      .filter(filterOutOnlyYhteishakuForms(hakutapa))
      .map(({ name, key }) => ({
        value: key,
        label: getFirstLanguageValue(name, language),
      })),
    [ataruLomakkeet, language, hakutapa]
  );
};
