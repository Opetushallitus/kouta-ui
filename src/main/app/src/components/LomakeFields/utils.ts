import { useMemo } from 'react';

import { useUrls } from '#/src/contexts/UrlContext';
import { useHakemuspalveluLomakkeet } from '#/src/utils/api/getHakemuspalveluLomakkeet';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

export const useAtaruLomakeUrl = option => {
  const apiUrls = useUrls();
  return (
    option?.value && apiUrls.url('lomake-editori.muokkaus-sivu', option.value)
  );
};

export const useLomakeOptions = ({ language }) => {
  const { data: ataruLomakkeet = [] } = useHakemuspalveluLomakkeet();

  return useMemo(
    () =>
      ataruLomakkeet.map(({ name, key }) => ({
        value: key,
        label: getFirstLanguageValue(name, language),
      })),
    [ataruLomakkeet, language]
  );
};
