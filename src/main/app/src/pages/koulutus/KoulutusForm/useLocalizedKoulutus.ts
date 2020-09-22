import { useEffect } from 'react';
import _ from 'lodash';
import useKoodi from '#/src/hooks/useKoodi';
import {
  useBoundFormActions,
  useIsDirty,
  useFieldValue,
} from '#/src/hooks/form';
import { useHasChanged } from '#/src/hooks/useHasChanged';

export const useLocalizedKoulutus = ({
  koulutusFieldName,
  nimiFieldName,
  language,
}) => {
  const koulutusValue = useFieldValue(koulutusFieldName);
  const koulutusKoodi = useKoodi(koulutusValue?.value);
  const koodi = koulutusKoodi?.koodi;
  const isDirty = useIsDirty();
  const { change } = useBoundFormActions();

  // When language changes, change the selected 'koulutus' label accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (koodi && isDirty) {
      const { metadata } = koodi;
      const localizedNimi = _.find(
        metadata,
        ({ kieli }) => _.toLower(kieli) === language
      )?.nimi;

      if (localizedNimi) {
        change(`${koulutusFieldName}.label`, localizedNimi);
      }
    }
  }, [language, koodi, koulutusFieldName, isDirty, change]);

  const koulutusHasChanged = useHasChanged(koulutusValue);

  // When koulutus field has changed to a defined value and got its 'koodi'
  // change the language versioned 'nimi' fields accordingly
  // if the form is dirty (don't override initial values)
  useEffect(() => {
    if (koulutusHasChanged && isDirty) {
      if (koodi) {
        _.each(koodi?.metadata, ({ kieli, nimi }) => {
          const lang = _.toLower(kieli);
          change(`${nimiFieldName}.${lang}`, nimi);
        });
      } else {
        change(nimiFieldName, {});
      }
    }
  }, [change, nimiFieldName, koodi, language, koulutusHasChanged, isDirty]);
};
