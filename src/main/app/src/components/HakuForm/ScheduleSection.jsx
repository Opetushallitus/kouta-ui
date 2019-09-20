import React from 'react';
import { Field, FieldArray } from 'redux-form';

import Button from '../Button';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import Flex, { FlexItem } from '../Flex';
import { getTestIdProps } from '../../utils';
import DividerHeading from '../DividerHeading';
import Box from '../Box';

import {
  FormFieldDateTimeInput,
  FormFieldRadioGroup,
  FormFieldYearSelect,
} from '../formFields';

const renderHakuajatFields = ({ fields, t }) => {
  return (
    <>
      {fields.map((hakuaika, index) => (
        <Flex key={index} mb={2} alignCenter>
          <FlexItem grow={1} paddingRight={2} {...getTestIdProps('alkaa')}>
            <Field
              name={`${hakuaika}.alkaa`}
              component={FormFieldDateTimeInput}
              label={t('yleiset.alkaa')}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FlexItem>
          <FlexItem grow={1} paddingLeft={2} {...getTestIdProps('paattyy')}>
            <Field
              name={`${hakuaika}.paattyy`}
              component={FormFieldDateTimeInput}
              label={t('yleiset.paattyy')}
              helperText={t('yleiset.paivamaaraJaKellonaika')}
            />
          </FlexItem>
          <FlexItem grow={0} paddingLeft={2}>
            <Button
              onClick={() => fields.remove(index)}
              variant="outlined"
              color="secondary"
            >
              {t('yleiset.poista')}
            </Button>
          </FlexItem>
        </Flex>
      ))}
      <Button
        type="button"
        variant="outlined"
        onClick={() => {
          fields.push({});
        }}
        {...getTestIdProps('lisaaButton')}
      >
        {t('yleiset.lisaaHakuaika')}
      </Button>
    </>
  );
};

const ScheduleSection = ({ isOphVirkailija, isYhteishaku, name }) => {
  const { t } = useTranslation();
  const { options: kausiOptions } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <Box mb={-4}>
      <Box mb={4} {...getTestIdProps('hakuajat')}>
        <DividerHeading>{t('hakulomake.hakuaika')}</DividerHeading>
        <FieldArray
          name={`${name}.hakuaika`}
          component={renderHakuajatFields}
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
            component={renderHakuajatFields}
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
