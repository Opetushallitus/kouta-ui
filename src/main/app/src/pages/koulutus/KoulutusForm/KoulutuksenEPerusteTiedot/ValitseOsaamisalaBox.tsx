import React, { useMemo, useEffect } from 'react';

import _ from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Anchor from '#/src/components/Anchor';
import { FormFieldSelect } from '#/src/components/formFields';
import { Box, Spin } from '#/src/components/virkailija';
import { useUrls } from '#/src/contexts/contextHooks';
import {
  useFieldValue,
  useBoundFormActions,
  useIsDirty,
} from '#/src/hooks/form';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { getTestIdProps } from '#/src/utils';
import { useEPerusteSisalto } from '#/src/utils/ePeruste/getEPerusteSisalto';
import { useEPerusteOsaamisalaKuvaukset } from '#/src/utils/ePeruste/getOsaamisalakuvauksetByEPerusteId';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { InfoBoxGrid, StyledInfoBox } from './InfoBox';

const getOsaamisalaOptions = (osaamisalat = [], language) =>
  _.map(({ arvo, nimi }) => ({
    label: getLanguageValue(nimi, language),
    value: arvo,
  }))(osaamisalat);

export const ValitseOsaamisalaBox = ({
  fieldName,
  selectedEPeruste,
  language,
  osaamisalat,
  koulutusIsLoading,
}) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();
  const selectedOsaamisala = useFieldValue(fieldName);

  const {
    data: ePerusteOsaamisalaKuvaukset,
    isLoading: osaamisalatIsLoading,
  } = useEPerusteOsaamisalaKuvaukset({
    ePerusteId: selectedEPeruste,
  });

  const selectedOsaamisalaKuvausId =
    ePerusteOsaamisalaKuvaukset?.[
      `osaamisala_${selectedOsaamisala?.value}`
    ]?.[0]?.id;

  const {
    data: ePerusteSisalto,
    isLoading: sisaltoIsLoading,
  } = useEPerusteSisalto({
    ePerusteId: selectedEPeruste,
  });

  const isLoading =
    koulutusIsLoading || osaamisalatIsLoading || sisaltoIsLoading;

  const osaamisalaOptions = useMemo(
    () => getOsaamisalaOptions(osaamisalat, language),
    [language, osaamisalat]
  );

  const selectedOsaamisalaData = _.find(
    ({ arvo }) => arvo === selectedOsaamisala?.value
  )(osaamisalat);

  const nimi = getLanguageValue(selectedOsaamisalaData?.nimi, language);

  const ePerusteHasChanged = useHasChanged(selectedEPeruste);

  const { change } = useBoundFormActions();

  const isDirty = useIsDirty();

  const perusteenOsaId = _.find(
    ({ _perusteenOsa }) =>
      Number(_perusteenOsa) === Number(selectedOsaamisalaKuvausId)
  )(ePerusteSisalto?.lapset)?.id;

  useEffect(() => {
    isDirty && ePerusteHasChanged && change(fieldName, null);
  }, [change, ePerusteHasChanged, fieldName, isDirty]);

  return (
    <StyledInfoBox mb={2}>
      <Box width={0.5} mb={2} {...getTestIdProps('osaamisalaSelect')}>
        <Field
          component={FormFieldSelect}
          name={fieldName}
          label={t('koulutuslomake.valitseOsaamisala')}
          options={osaamisalaOptions}
          disabled={_.isNil(osaamisalat) || _.isEmpty(osaamisalat)}
        />
      </Box>
      {isLoading ? (
        <Spin />
      ) : selectedOsaamisalaData ? (
        <InfoBoxGrid
          rows={[
            {
              title: t('koulutuslomake.osaamisala'),
              description: nimi,
            },
            {
              title: t('yleiset.koodi'),
              description: (
                <Anchor
                  href={apiUrls.url(
                    'eperusteet.sisalto',
                    language,
                    selectedEPeruste,
                    perusteenOsaId
                  )}
                  target="_blank"
                >
                  {selectedOsaamisalaData?.arvo}
                </Anchor>
              ),
            },
          ]}
        />
      ) : (
        <div></div>
      )}
    </StyledInfoBox>
  );
};
