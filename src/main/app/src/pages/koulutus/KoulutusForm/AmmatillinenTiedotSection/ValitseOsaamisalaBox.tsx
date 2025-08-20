import React, { useMemo, useEffect } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Anchor from '#/src/components/Anchor';
import { FormFieldSelect } from '#/src/components/formFields';
import { Box, Spin } from '#/src/components/virkailija';
import { useUrls } from '#/src/contexts/UrlContext';
import {
  useFieldValue,
  useBoundFormActions,
  useIsDirty,
} from '#/src/hooks/form';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { getTestIdProps } from '#/src/utils';
import { useEPerusteRakenne } from '#/src/utils/ePeruste/getEPerusteRakenne';
import { useEPerusteSisalto } from '#/src/utils/ePeruste/getEPerusteSisalto';
import { useEPerusteOsaamisalaKuvaukset } from '#/src/utils/ePeruste/getOsaamisalakuvauksetByEPerusteId';
import getOsaamisalaLaajuus from '#/src/utils/koulutus/getOsaamisalaLaajuus';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { InfoBoxGrid, StyledInfoBox } from './InfoBox';

export type OsaamisalaOsa = {
  muodostumisSaanto: { laajuus: { minimi: number } };
  osaamisala: { osaamisalakoodiArvo: number };
};

const getOsaamisalaOptions = (osaamisalat = [], language) =>
  _fp.map(({ arvo, nimi }) => ({
    label: getLanguageValue(nimi, language),
    value: arvo,
  }))(osaamisalat);

export const ValitseOsaamisalaBox = ({
  fieldName,
  language,
  selectedEPeruste,
  koulutusIsLoading,
  disabled,
  languages,
}) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();
  const selectedOsaamisala = useFieldValue(fieldName);
  const osaamisalaChanged = useHasChanged(selectedOsaamisala);

  const selectedEPerusteId = selectedEPeruste?.id;

  const osaamisalat = selectedEPeruste?.osaamisalat;

  const { data: ePerusteOsaamisalaKuvaukset, isLoading: osaamisalatIsLoading } =
    useEPerusteOsaamisalaKuvaukset({
      ePerusteId: selectedEPerusteId,
    });

  const selectedOsaamisalaKuvausId =
    ePerusteOsaamisalaKuvaukset?.[
      `osaamisala_${selectedOsaamisala?.value}`
    ]?.[0]?.id;

  const { data: ePerusteSisalto, isLoading: sisaltoIsLoading } =
    useEPerusteSisalto({
      ePerusteId: selectedEPerusteId,
    });

  const { data: ePerusteRakenne, isLoading: rakenneIsLoading } =
    useEPerusteRakenne({
      ePerusteId: selectedEPerusteId,
    });

  const isLoading =
    koulutusIsLoading ||
    osaamisalatIsLoading ||
    sisaltoIsLoading ||
    rakenneIsLoading;

  const osaamisalaOptions = useMemo(
    () => getOsaamisalaOptions(osaamisalat, language),
    [language, osaamisalat]
  );

  const selectedOsaamisalaData = _fp.find(
    ({ arvo }) => arvo === selectedOsaamisala?.value
  )(osaamisalat);

  /* Get laajuus for selected osaamisala */
  const ePerusteRakenneOsat: Array<OsaamisalaOsa> = ePerusteRakenne?.osat;
  const osaamisalakoodi = selectedOsaamisalaData?.arvo;

  let osaamisalaLaajuus;
  if (ePerusteRakenneOsat) {
    osaamisalaLaajuus = getOsaamisalaLaajuus(
      ePerusteRakenneOsat,
      osaamisalakoodi
    );
  }

  const nimi = getLanguageValue(selectedOsaamisalaData?.nimi, language);

  const ePerusteHasChanged = useHasChanged(selectedEPerusteId);

  const { change } = useBoundFormActions();

  const isDirty = useIsDirty();

  const perusteenOsaId = _fp.find(
    ({ _perusteenOsa }) =>
      Number(_perusteenOsa) === Number(selectedOsaamisalaKuvausId)
  )(ePerusteSisalto?.lapset)?.id;

  useEffect(() => {
    if (isDirty && ePerusteHasChanged) {
      change(fieldName, null);
    }
  }, [change, ePerusteHasChanged, fieldName, isDirty]);

  useEffect(() => {
    if (isDirty && osaamisalaChanged) {
      const selectedOsaamisalaData = _fp.find(
        osaamisala => osaamisala?.arvo === selectedOsaamisala?.value,
        osaamisalat
      );
      if (selectedOsaamisalaData) {
        change(
          'information.nimi',
          _fp.pick(languages, selectedOsaamisalaData?.nimi)
        );
      } else {
        change('information.nimi', {});
      }
    }
  }, [
    change,
    isDirty,
    languages,
    osaamisalaChanged,
    selectedOsaamisala,
    osaamisalat,
  ]);

  return (
    <StyledInfoBox mb={2}>
      <Box width={0.7} mb={2} {...getTestIdProps('osaamisalaSelect')}>
        <Field
          component={FormFieldSelect}
          name={fieldName}
          label={t('koulutuslomake.valitseOsaamisala')}
          options={osaamisalaOptions}
          disabled={
            disabled || _fp.isNil(osaamisalat) || _fp.isEmpty(osaamisalat)
          }
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
                    selectedEPerusteId,
                    perusteenOsaId
                  )}
                  target="_blank"
                >
                  {selectedOsaamisalaData?.arvo}
                </Anchor>
              ),
            },
            {
              title: t('koulutuslomake.osaamisalanLaajuus'),
              description: osaamisalaLaajuus,
              suffix: t('yleiset.osaamispistetta'),
            },
          ]}
        />
      ) : (
        <div></div>
      )}
    </StyledInfoBox>
  );
};
