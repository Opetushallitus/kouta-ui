import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { useTranslation } from 'react-i18next';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getTestIdProps } from '#/src/utils';
import Box from '#/src/components/Box';
import HakuajatFields from '#/src/components/HakuajatFields';
import FieldGroup from '#/src/components/FieldGroup';

import {
  FormFieldDateTimeInput,
  FormFieldRadioGroup,
  FormFieldYearSelect,
} from '#/src/components/formFields';

const ScheduleSection = ({ isOphVirkailija, isYhteishaku, name }) => {
  const { t } = useTranslation();
  const { options: kausiOptions } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <Box mb={-4}>
      <FieldGroup
        title={t('hakulomake.hakuaika')}
        name={`${name}.hakuaikaGroup`}
        {...getTestIdProps('hakuajat')}
      >
        <FieldArray
          name={`${name}.hakuaika`}
          component={HakuajatFields}
          t={t}
        />
      </FieldGroup>

      {isYhteishaku && isOphVirkailija ? (
        <FieldGroup
          title={t('hakulomake.aikatauluTulevaisuudesta')}
          {...getTestIdProps('tulevaisuudenaikataulu')}
        >
          <FieldArray
            name={`${name}.aikataulu`}
            component={HakuajatFields}
            t={t}
          />
        </FieldGroup>
      ) : null}

      <FieldGroup
        title={t('hakulomake.koulutuksenAlkamiskausi')}
        {...getTestIdProps('alkamiskausi')}
      >
        <Box mb={2} {...getTestIdProps('kausi')}>
          <Field
            name={`${name}.kausi`}
            component={FormFieldRadioGroup}
            options={kausiOptions}
            label={t('yleiset.kausi')}
          />
        </Box>

        <Box {...getTestIdProps('vuosi')}>
          <Field
            name={`${name}.vuosi`}
            component={FormFieldYearSelect}
            label={t('yleiset.vuosi')}
          />
        </Box>
      </FieldGroup>

      {isYhteishaku && isOphVirkailija ? (
        <>
          <FieldGroup
            title={t('hakulomake.hakukohteenLisaamisenJaPerumisenTakaraja')}
            {...getTestIdProps('perumisenTakaraja')}
          >
            <Field
              name={`${name}.lisaamisenTakaraja`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FieldGroup>

          <FieldGroup
            title={t('hakulomake.hakukohteenMuokkauksenTakaraja')}
            {...getTestIdProps('muokkauksenTakaraja')}
          >
            <Field
              name={`${name}.muokkauksenTakaraja`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FieldGroup>

          <FieldGroup
            title={t('hakulomake.ajastettuHaunJulkaisupaivamaara')}
            {...getTestIdProps('julkaisupaivamaara')}
          >
            <Field
              name={`${name}.ajastettuJulkaisu`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FieldGroup>
        </>
      ) : null}
    </Box>
  );
};

export default ScheduleSection;
