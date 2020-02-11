import React from 'react';
import { Field, FieldArray } from 'redux-form';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import { getTestIdProps } from '../../utils';
import DividerHeading from '../DividerHeading';
import Box from '../Box';
import HakuajatFields from '../HakuajatFields';

import {
  FormFieldDateTimeInput,
  FormFieldRadioGroup,
  FormFieldYearSelect,
} from '../formFields';

const ScheduleSection = ({ isOphVirkailija, isYhteishaku, name }) => {
  const { t } = useTranslation();
  const { options: kausiOptions } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <Box mb={-4}>
      <Box mb={4} {...getTestIdProps('hakuajat')}>
        <DividerHeading>{t('hakulomake.hakuaika')}</DividerHeading>
        <FieldArray
          name={`${name}.hakuaika`}
          component={HakuajatFields}
          t={t}
        />
      </Box>

      {isYhteishaku && isOphVirkailija ? (
        <Box mb={4} {...getTestIdProps('tulevaisuudenaikataulu')}>
          <DividerHeading>
            {t('hakulomake.aikatauluTulevaisuudesta')}
          </DividerHeading>
          <FieldArray
            name={`${name}.aikataulu`}
            component={HakuajatFields}
            t={t}
          />
        </Box>
      ) : null}

      <Box mb={4} {...getTestIdProps('alkamiskausi')}>
        <DividerHeading>
          {t('hakulomake.koulutuksenAlkamiskausi')}
        </DividerHeading>

        <Box mb={2} {...getTestIdProps('kausi')}>
          <Field
            name={`${name}.kausi`}
            component={FormFieldRadioGroup}
            options={kausiOptions}
            label={t('yleiset.kausi')}
          />
        </Box>

        <Box>
          <div {...getTestIdProps('vuosi')}>
            <Field
              name={`${name}.vuosi`}
              component={FormFieldYearSelect}
              label={t('yleiset.vuosi')}
            />
          </div>
        </Box>
      </Box>

      {isYhteishaku && isOphVirkailija ? (
        <>
          <Box mb={4} {...getTestIdProps('perumisenTakaraja')}>
            <DividerHeading>
              {t('hakulomake.hakukohteenLisaamisenJaPerumisenTakaraja')}
            </DividerHeading>
            <Field
              name={`${name}.lisaamisenTakaraja`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </Box>

          <Box mb={4} {...getTestIdProps('muokkauksenTakaraja')}>
            <DividerHeading>
              {t('hakulomake.hakukohteenMuokkauksenTakaraja')}
            </DividerHeading>
            <Field
              name={`${name}.muokkauksenTakaraja`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </Box>

          <Box mb={4} {...getTestIdProps('julkaisupaivamaara')}>
            <DividerHeading>
              {t('hakulomake.ajastettuHaunJulkaisupaivamaara')}
            </DividerHeading>
            <Field
              name={`${name}.ajastettuJulkaisu`}
              component={FormFieldDateTimeInput}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default ScheduleSection;
