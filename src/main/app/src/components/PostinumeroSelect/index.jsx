import React, { useCallback, useContext } from 'react';
import upperFirst from 'lodash/upperFirst';

import UrlContext from '../UrlContext';
import HttpContext from '../HttpContext';
import { AsyncSelect } from '../Select';
import { isString, isObject } from '../../utils';
import useLanguage from '../useLanguage';
import getKoodi from '../../utils/koodistoService/getKoodi';
import getKoodiNimiTranslation from '../../utils/getKoodiNimiTranslation';
import useKoodi from '../useKoodi';

const getKoodiOption = (koodi, versio, language) => {
  const { koodiUri } = koodi;

  const [, postinumero] = koodiUri.split('_');

  return {
    label: `${postinumero} ${upperFirst(
      getKoodiNimiTranslation(koodi, language).toLowerCase(),
    )}`,
    value: `${koodiUri}#${versio}`,
  };
};

const PostinumeroSelect = ({
  value: valueProp,
  koodistoVersio = 2,
  ...props
}) => {
  const httpClient = useContext(HttpContext);
  const apiUrls = useContext(UrlContext);
  const language = useLanguage();

  const valueKoodiUri = isObject(valueProp) ? valueProp.value : undefined;
  const valueLabel = isObject(valueProp) ? valueProp.label : undefined;

  const { koodi: valueKoodi, isLoading } = useKoodi(
    valueLabel ? undefined : valueKoodiUri,
  );

  console.log(valueProp);

  const value = isObject(valueProp)
    ? {
        ...(valueKoodi ? getKoodiOption(valueKoodi, koodistoVersio) : {}),
        ...valueProp,
      }
    : valueProp;

  const loadOptions = useCallback(
    async inputValue => {
      if (!isString(inputValue)) {
        return [];
      }

      const koodiStr = `posti_${inputValue}`;

      try {
        const koodi = await getKoodi({
          httpClient,
          apiUrls,
          koodi: koodiStr,
          versio: koodistoVersio,
          silent: true,
        });

        if (koodi) {
          return [getKoodiOption(koodi, language)];
        }
      } catch (e) {
        console.log(e);
      }

      return [];
    },
    [httpClient, apiUrls, language, koodistoVersio],
  );

  return (
    <AsyncSelect
      isClearable={true}
      loadOptions={loadOptions}
      value={value}
      isLoading={isLoading}
      {...props}
    />
  );
};

export default PostinumeroSelect;
