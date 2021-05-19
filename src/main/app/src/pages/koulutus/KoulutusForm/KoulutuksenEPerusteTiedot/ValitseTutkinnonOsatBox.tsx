import React, { useMemo, useEffect } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { usePrevious } from 'react-use';
import { Field } from 'redux-form';

import Anchor from '#/src/components/Anchor';
import { FormFieldSelect } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { WithQueryIndicators } from '#/src/components/WithQueryIndicators';
import { useUrls } from '#/src/contexts/UrlContext';
import {
  useFieldValue,
  useBoundFormActions,
  useIsDirty,
} from '#/src/hooks/form';
import { getTestIdProps } from '#/src/utils';
import { useTutkinnonOsienKuvaukset } from '#/src/utils/koulutus/getTutkinnonOsanKuvaus';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { InfoBoxGrid, StyledInfoBox } from './InfoBox';

const getTutkinnonosatOptions = (selectedPeruste, language) =>
  _.map(
    selectedPeruste?.tutkinnonosat ?? [],
    ({ _tutkinnonOsa, nimi, laajuus, id }) => ({
      label: `${getLanguageValue(nimi, language)}, ${laajuus} osp`,
      value: _tutkinnonOsa,
      viite: id,
    })
  );

const TutkinnonOsatField = ({ isLoading, ...props }) => {
  const { selectedEPeruste, language } = props;
  const { t } = useTranslation();
  const tutkinnonosatOptions = useMemo(
    () => getTutkinnonosatOptions(selectedEPeruste, language),
    [selectedEPeruste, language]
  );

  return (
    <Field
      component={FormFieldSelect}
      label={t('koulutuslomake.valitseKaytettavaTutkinnonOsa')}
      options={tutkinnonosatOptions}
      disabled={
        isLoading || _.isNil(selectedEPeruste) || _.isEmpty(selectedEPeruste)
      }
      isMulti={true}
      required
      {...props}
    />
  );
};

const TutkinnonOsaInfo = ({ ePerusteId, tutkinnonOsa, language }) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();
  return (
    <InfoBoxGrid
      style={{ marginBottom: '40px' }}
      rows={[
        {
          title: t('yleiset.nimi'),
          description: `${getLanguageValue(tutkinnonOsa.nimi, language)}`,
        },
        {
          title: t('yleiset.koodi'),
          description: (
            <Anchor
              href={apiUrls.url(
                'eperusteet.tutkinnonosat',
                language,
                ePerusteId,
                tutkinnonOsa?.id
              )}
              target="_blank"
            >
              {tutkinnonOsa?.koodiArvo}
            </Anchor>
          ),
        },
      ]}
    />
  );
};

export const ValitseTutkinnonOsatBox = ({
  fieldName,
  disabled,
  language,
  ePeruste,
}) => {
  const tutkinnonosatFieldValue = useFieldValue(fieldName);
  const selectedTutkinnonosat = useMemo(
    () =>
      _.filter(ePeruste?.tutkinnonosat, t =>
        _.some(
          tutkinnonosatFieldValue,
          ({ value }) => value === t._tutkinnonOsa
        )
      ),
    [ePeruste, tutkinnonosatFieldValue]
  );

  const { change } = useBoundFormActions();

  const previousEPerusteId = usePrevious(ePeruste?.id);

  const { data: kuvaukset, status, isLoading } = useTutkinnonOsienKuvaukset({
    tutkinnonOsat: selectedTutkinnonosat?.map(t => t?._tutkinnonOsa),
  });

  const isDirty = useIsDirty();

  useEffect(() => {
    if (isDirty && previousEPerusteId !== ePeruste?.id) {
      change(fieldName, null);
    }
  }, [change, ePeruste?.id, isDirty, fieldName, previousEPerusteId]);

  const tutkinnonOsienKuvaukset = useMemo(
    () =>
      kuvaukset?.map(({ id, koodiArvo }) => {
        return {
          ...(selectedTutkinnonosat?.find(
            t => _.toNumber(t?._tutkinnonOsa) === id
          ) || {}),
          koodiArvo,
        };
      }),
    [kuvaukset, selectedTutkinnonosat]
  );

  return (
    <StyledInfoBox>
      <Box width={0.7} mb={2} {...getTestIdProps('tutkinnonOsatSelect')}>
        <TutkinnonOsatField
          isLoading={isLoading}
          name={fieldName}
          selectedEPeruste={ePeruste}
          language={language}
          disabled={disabled}
        />
      </Box>
      {tutkinnonosatFieldValue && (
        <WithQueryIndicators queryStatus={status}>
          <Box>
            {_.map(tutkinnonOsienKuvaukset, tutkinnonOsa => (
              <TutkinnonOsaInfo
                key={tutkinnonOsa?.id}
                tutkinnonOsa={tutkinnonOsa}
                language={language}
                ePerusteId={ePeruste?.id}
              />
            ))}
          </Box>
        </WithQueryIndicators>
      )}
    </StyledInfoBox>
  );
};
