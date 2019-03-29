import React from 'react';
import { Field, FieldArray, formValues } from 'redux-form';
import styled, { css } from 'styled-components';

import Typography from '../Typography';
import Spacing from '../Spacing';
import Checkbox from '../Checkbox';
import InputMask from '../InputMask';
import Button from '../Button';
import { isArray, formatKoutaDateString } from '../../utils';
import useTranslation from '../useTranslation';

const HakuaikaInterval = ({ haku }) => {
  const dateFormat = 'DD.MM.YYYY HH:mm';
  const { t } = useTranslation();

  const hakuajat = (haku && isArray(haku.hakuajat) ? haku.hakuajat : []).map(
    ({ alkaa, paattyy }) => [
      formatKoutaDateString(alkaa, dateFormat),
      formatKoutaDateString(paattyy, dateFormat),
    ],
  );

  return hakuajat.length === 0 ? (
    <Typography variant="secondary">
      {t('hakukohdelomake.haullaEiHakuaikaa')}
    </Typography>
  ) : (
    hakuajat.map(([start, end], index) => (
      <Typography
        variant="div"
        marginBottom={index < hakuajat.length - 1 ? 1 : 0}
        key={index}
      >
        {start} - {end}
      </Typography>
    ))
  );
};

const renderCheckboxField = ({ input, label = null }) => (
  <Checkbox checked={input.value} onChange={input.onChange} children={label} />
);

const renderInputMaskField = ({ input, ...props }) => (
  <InputMask {...input} {...props} />
);

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

const renderHakuajatFields = ({ fields, t }) => (
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

const CustomHakuaika = () => {
  const { t } = useTranslation();

  return (
    <Spacing marginTop={2}>
      <FieldArray name="hakuajat" component={renderHakuajatFields} t={t} />
    </Spacing>
  );
};

const EriHakuaikaFieldValue = formValues({
  eriHakuaika: 'eriHakuaika',
})(({ eriHakuaika, children }) => children({ eriHakuaika }));

const HakuajatSection = ({ haku }) => {
  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          {t('hakukohdelomake.hakuunLiitetytHakuajat')}
        </Typography>
        <HakuaikaInterval haku={haku} />
      </Spacing>
      <Field
        name="eriHakuaika"
        component={renderCheckboxField}
        label={t('hakukohdelomake.hakukohteellaEriHakuaika')}
      />
      <EriHakuaikaFieldValue>
        {({ eriHakuaika }) => (eriHakuaika ? <CustomHakuaika /> : null)}
      </EriHakuaikaFieldValue>
    </>
  );
};

export default HakuajatSection;
