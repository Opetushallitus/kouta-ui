import useKoodisto from '#/src/hooks/useKoodisto';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';

const useOsaamisalatNotInEPerusteOptions = (
  osaamisalatFromEPeruste,
  wrongOsaamisalat: Array,
  osaamisalaOptions,
  language: string
) => {
  const { data: osaamisalatKoodistodata = [] } = useKoodisto({
    koodisto: 'osaamisala',
  });

  const options = useKoodistoDataOptions({
    koodistoData: osaamisalatKoodistodata,
    lang: language,
  });

  const osaamisalaFieldsValues = _.unionWith(
    osaamisalatFromEPeruste,
    wrongOsaamisalat,
    _.isEqual
  );

  let selectedOsaamisalat;
  if (!_.isEmpty(options)) {
    selectedOsaamisalat = _.map(osaamisalaFieldsValues, uri => {
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

  return _.differenceWith(selectedOsaamisalat, osaamisalaOptions, _.isEqual);
};

export default useOsaamisalatNotInEPerusteOptions;
