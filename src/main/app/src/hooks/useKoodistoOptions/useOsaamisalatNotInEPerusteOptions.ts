import useKoodisto from '#/src/hooks/useKoodisto';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';

const useOsaamisalatNotInEPerusteOptions = (
  selectedOsaamisalat,
  osaamisalaOptions,
  language
) => {
  const { data: osaamisalatKoodistodata = [] } = useKoodisto({
    koodisto: 'osaamisala',
  });

  const options = useKoodistoDataOptions({
    koodistoData: osaamisalatKoodistodata,
    lang: language,
  });

  let selectedOsaamisalaOptions;
  if (!_.isEmpty(options)) {
    selectedOsaamisalaOptions = _.map(selectedOsaamisalat, uri => {
      const found = _.find(options, option => {
        return option.value.split('#')[0] === uri;
      });

      if (found) {
        return {
          ...found,
          value: found.value.split('#')[0],
        };
      }
    });
  }

  return _.differenceWith(
    selectedOsaamisalaOptions,
    osaamisalaOptions,
    _.isEqual
  );
};

export default useOsaamisalatNotInEPerusteOptions;
