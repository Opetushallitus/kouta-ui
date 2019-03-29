import React from 'react';
import styled, { css } from 'styled-components';
import { Field, FieldArray } from 'redux-form';

import { RadioGroup } from '../Radio';
import Button from '../Button';
import Spacing from '../Spacing';
import InputMask from '../InputMask';
import Typography from '../Typography';
import YearSelect from '../YearSelect';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import Flex, { FlexItem } from '../Flex';
import { noop } from '../../utils';

const BorderHeading = styled(Typography).attrs({
  variant: 'h6',
  paddingBottom: 1,
  marginBottom: 2,
})`
  border-bottom: 1px solid ${({ theme }) => theme.palette.border};
`;

const HakuContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.unit * 2}px;
  align-items: center;
`;

const HakuDateTimeContainer = styled.div`
  flex: 1;
  ${({ first }) =>
    first
      ? css`
          padding-right: ${({ theme }) => theme.spacing.unit * 2}px;
        `
      : css`
          padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
        `}
`;

const HakuDateTimeWrapper = styled.div`
  display: flex;
`;

const HakuDateContainer = styled.div`
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const HakuTimeContainer = styled.div`
  flex: 0;
  flex-basis: 30%;
`;

const HakuRemoveContainer = styled.div`
  flex: 0;
  padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
  display: flex;
  align-items: center;
`;

const renderRadioGroupField = ({ input, options }) => (
  <RadioGroup {...input} options={options} />
);

const renderYearField = ({ input }) => <YearSelect {...input} onBlur={noop} />;

const renderInputMaskField = ({ input, ...props }) => (
  <InputMask {...input} {...props} />
);

const renderHakuajatFields = ({ fields, t }) => {
  return (
    <>
      {fields.map((hakuaika, index) => (
        <HakuContainer key={index}>
          <HakuDateTimeContainer first>
            <Typography as="div" marginBottom={1}>
              {t('yleiset.alkaa')}
            </Typography>
            <HakuDateTimeWrapper>
              <HakuDateContainer>
                <Field
                  name={`${hakuaika}.fromDate`}
                  placeholder="pp.kk.vvvv"
                  component={renderInputMaskField}
                  mask="99.99.9999"
                />
              </HakuDateContainer>
              <HakuTimeContainer>
                <Field
                  name={`${hakuaika}.fromTime`}
                  placeholder="tt:mm"
                  component={renderInputMaskField}
                  mask="99:99"
                />
              </HakuTimeContainer>
            </HakuDateTimeWrapper>
            <Typography variant="secondary" as="div" marginTop={1}>
              {t('yleiset.paivamaaraJaKellonaika')}
            </Typography>
          </HakuDateTimeContainer>
          <HakuDateTimeContainer>
            <Typography as="div" marginBottom={1}>
              {t('yleiset.paattyy')}
            </Typography>
            <HakuDateTimeWrapper>
              <HakuDateContainer>
                <Field
                  name={`${hakuaika}.toDate`}
                  placeholder="pp.kk.vvvv"
                  component={renderInputMaskField}
                  mask="99.99.9999"
                />
              </HakuDateContainer>
              <HakuTimeContainer>
                <Field
                  name={`${hakuaika}.toTime`}
                  placeholder="tt:mm"
                  component={renderInputMaskField}
                  mask="99:99"
                />
              </HakuTimeContainer>
            </HakuDateTimeWrapper>
            <Typography variant="secondary" as="div" marginTop={1}>
              {t('yleiset.paivamaaraJaKellonaika')}
            </Typography>
          </HakuDateTimeContainer>
          <HakuRemoveContainer>
            <Button
              type="button"
              onClick={() => {
                fields.remove(index);
              }}
              variant="outlined"
              color="secondary"
            >
              {t('yleiset.poista')}
            </Button>
          </HakuRemoveContainer>
        </HakuContainer>
      ))}
      <Button
        type="button"
        onClick={() => {
          fields.push({});
        }}
      >
        {t('yleiset.lisaaHakuaika')}
      </Button>
    </>
  );
};

const ScheduleSection = props => {
  const { t } = useTranslation();
  const { options: kausiOptions } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <>
      <Spacing marginBottom={2}>
        <BorderHeading>{t('hakulomake.hakuaika')}</BorderHeading>
        <FieldArray name="hakuaika" component={renderHakuajatFields} t={t} />
      </Spacing>
      <Spacing marginBottom={2}>
        <BorderHeading>
          {t('hakulomake.aikatauluTulevaisuudesta')}
        </BorderHeading>
        <FieldArray name="aikataulu" component={renderHakuajatFields} t={t} />
      </Spacing>

      <Spacing marginBottom={2}>
        <BorderHeading>{t('hakulomake.koulutuksenAlkamiskausi')}</BorderHeading>

        <Spacing marginBottom={2}>
          <Typography as="div" marginBottom={1}>
            {t('yleiset.kausi')}
          </Typography>

          <Field
            name="kausi"
            component={renderRadioGroupField}
            options={kausiOptions}
          />
        </Spacing>

        <Spacing>
          <Typography as="div" marginBottom={1}>
            {t('yleiset.vuosi')}
          </Typography>
          <Field name="vuosi" component={renderYearField} />
        </Spacing>
      </Spacing>

      <Spacing marginBottom={2}>
        <BorderHeading>
          {t('hakulomake.hakukohteenLisaamisenJaPerumisenTakaraja')}
        </BorderHeading>
        <Flex>
          <FlexItem grow={1}>
            <Field
              name="liittäminen_pvm"
              placeholder="pp.kk.vvvv"
              component={renderInputMaskField}
              mask="99.99.9999"
            />
          </FlexItem>
          <FlexItem basis="30%" grow={0} paddingLeft={2}>
            <Field
              name="liittäminen_aika"
              placeholder="tt:mm"
              component={renderInputMaskField}
              mask="99:99"
            />
          </FlexItem>
        </Flex>
        <Typography variant="secondary" as="div" marginTop={1}>
          {t('yleiset.paivamaaraJaKellonaika')}
        </Typography>
      </Spacing>

      <Spacing marginBottom={2}>
        <BorderHeading>
          {t('hakulomake.hakukohteenMuokkauksenTakaraja')}
        </BorderHeading>
        <Flex>
          <FlexItem grow={1}>
            <Field
              name="muokkaus_pvm"
              placeholder="pp.kk.vvvv"
              component={renderInputMaskField}
              mask="99.99.9999"
            />
          </FlexItem>
          <FlexItem basis="30%" grow={0} paddingLeft={2}>
            <Field
              name="muokkaus_aika"
              placeholder="tt:mm"
              component={renderInputMaskField}
              mask="99:99"
            />
          </FlexItem>
        </Flex>
        <Typography variant="secondary" as="div" marginTop={1}>
          {t('yleiset.paivamaaraJaKellonaika')}
        </Typography>
      </Spacing>

      <Spacing>
        <BorderHeading>
          {t('hakulomake.ajastettuHaunJulkaisupaivamaara')}
        </BorderHeading>
        <Flex>
          <FlexItem grow={1}>
            <Field
              name="julkaisu_pvm"
              placeholder="pp.kk.vvvv"
              component={renderInputMaskField}
              mask="99.99.9999"
            />
          </FlexItem>
          <FlexItem basis="30%" grow={0} paddingLeft={2}>
            <Field
              name="julkaisu_aika"
              placeholder="tt:mm"
              component={renderInputMaskField}
              mask="99:99"
            />
          </FlexItem>
        </Flex>
        <Typography variant="secondary" as="div" marginTop={1}>
          {t('yleiset.paivamaaraJaKellonaika')}
        </Typography>
      </Spacing>
    </>
  );
};

export default ScheduleSection;
