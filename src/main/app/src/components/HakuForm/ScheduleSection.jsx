import React from 'react';
import styled from 'styled-components';
import { Field, FieldArray } from 'redux-form';

import Button from '../Button';
import Spacing from '../Spacing';
import Typography from '../Typography';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import Flex, { FlexItem } from '../Flex';
import { getTestIdProps } from '../../utils';

import {
  FormFieldDateTimeInput,
  FormFieldRadioGroup,
  FormFieldYearSelect,
} from '../FormFields';

const BorderHeading = styled(Typography).attrs({
  variant: 'h6',
  paddingBottom: 1,
  marginBottom: 2,
})`
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
`;

const renderHakuajatFields = ({ fields, t }) => {
  return (
    <>
      {fields.map((hakuaika, index) => (
        <Flex key={index} marginBottom={2} alignCenter>
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

const ScheduleSection = () => {
  const { t } = useTranslation();
  const { options: kausiOptions } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <>
      <Spacing marginBottom={2} {...getTestIdProps('hakuajat')}>
        <BorderHeading>{t('hakulomake.hakuaika')}</BorderHeading>
        <FieldArray name="hakuaika" component={renderHakuajatFields} t={t} />
      </Spacing>
      <Spacing marginBottom={2} {...getTestIdProps('tulevaisuudenaikataulu')}>
        <BorderHeading>
          {t('hakulomake.aikatauluTulevaisuudesta')}
        </BorderHeading>
        <FieldArray name="aikataulu" component={renderHakuajatFields} t={t} />
      </Spacing>

      <Spacing marginBottom={2} {...getTestIdProps('alkamiskausi')}>
        <BorderHeading>{t('hakulomake.koulutuksenAlkamiskausi')}</BorderHeading>

        <Spacing marginBottom={2} {...getTestIdProps('kausi')}>
          <Field
            name="kausi"
            component={FormFieldRadioGroup}
            options={kausiOptions}
            label={t('yleiset.kausi')}
          />
        </Spacing>

        <Spacing>
          <div {...getTestIdProps('vuosi')}>
            <Field
              name="vuosi"
              component={FormFieldYearSelect}
              label={t('yleiset.vuosi')}
            />
          </div>
        </Spacing>
      </Spacing>

      <Spacing marginBottom={2} {...getTestIdProps('perumisenTakaraja')}>
        <BorderHeading>
          {t('hakulomake.hakukohteenLisaamisenJaPerumisenTakaraja')}
        </BorderHeading>
        <Field
          name="lisaamisenTakaraja"
          component={FormFieldDateTimeInput}
          helperText={t('yleiset.paivamaaraJaKellonaika')}
        />
      </Spacing>

      <Spacing marginBottom={2} {...getTestIdProps('muokkauksenTakaraja')}>
        <BorderHeading>
          {t('hakulomake.hakukohteenMuokkauksenTakaraja')}
        </BorderHeading>
        <Field
          name="muokkauksenTakaraja"
          component={FormFieldDateTimeInput}
          helperText={t('yleiset.paivamaaraJaKellonaika')}
        />
      </Spacing>

      <Spacing {...getTestIdProps('julkaisupaivamaara')}>
        <BorderHeading>
          {t('hakulomake.ajastettuHaunJulkaisupaivamaara')}
        </BorderHeading>
        <Field
          name="ajastettuJulkaisu"
          component={FormFieldDateTimeInput}
          helperText={t('yleiset.paivamaaraJaKellonaika')}
        />
      </Spacing>
    </>
  );
};

export default ScheduleSection;
