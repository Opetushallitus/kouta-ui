import React, { useMemo } from 'react';

import _ from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import AbstractCollapse from '#/src/components/AbstractCollapse';
import Anchor, { RouterAnchor } from '#/src/components/Anchor';
import { FieldGroup } from '#/src/components/FieldGroup';
import {
  FormFieldInput,
  createFormFieldComponent,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import {
  Box,
  CheckboxGroup,
  Divider,
  Icon,
  Typography,
} from '#/src/components/virkailija';
import { useUrls } from '#/src/contexts/UrlContext';
import { useFieldValue } from '#/src/hooks/form';
import useKoodisto from '#/src/hooks/useKoodisto';
import { useKoodistoDataOptions } from '#/src/hooks/useKoodistoOptions';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
import { getThemeProp } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import { getLanguageValue } from '#/src/utils/languageUtils';

const Container = styled.div`
  display: flex;
`;

const SelectionContainer = styled.div`
  flex: 0;
  flex-basis: 40%;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding-left: ${({ theme }) => theme.spacing.unit * 2}px;
`;

const OsaamisalaDetailsToggleContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${getThemeProp('typography.body')};
`;

const OsaamisalaDetailsToggle = ({ open, onToggle, ...props }) => {
  const { t } = useTranslation();
  return (
    <OsaamisalaDetailsToggleContainer onClick={onToggle} {...props}>
      <Icon type={open ? 'arrow_drop_down' : 'arrow_right'} />
      <Typography>
        {open
          ? t('toteutuslomake.suljeTarkempiKuvaus')
          : t('toteutuslomake.tarkennaKuvausta')}
      </Typography>
    </OsaamisalaDetailsToggleContainer>
  );
};

const OsaamisalaDetails = ({ osaamisala, language, name }) => {
  const { t } = useTranslation();

  return (
    <Box marginTop={2}>
      <Box
        marginBottom={2}
        {...getTestIdProps(`osaamisalaLinkki.${osaamisala.uri}`)}
      >
        <Field
          name={`${name}.osaamisalaLinkit.${osaamisala.uri}.${language}`}
          component={FormFieldUrlInput}
          label={t('yleiset.linkki')}
        />
      </Box>
      <Box {...getTestIdProps(`osaamisalaOtsikko.${osaamisala.uri}`)}>
        <Field
          name={`${name}.osaamisalaLinkkiOtsikot.${osaamisala.uri}.${language}`}
          component={FormFieldInput}
          label={t('yleiset.linkinOtsikko')}
        />
      </Box>
    </Box>
  );
};

const OsaamisalatInfoFields = ({
  osaamisalatValue,
  osaamisalat,
  language,
  name,
}) => {
  const activeOsaamisalat = osaamisalat.filter(({ uri }) =>
    osaamisalatValue.includes(uri)
  );

  return activeOsaamisalat.map((osaamisala, index) => {
    const { nimi, kuvaus, uri } = osaamisala;

    return (
      <div key={uri}>
        <Box key={uri}>
          <Box marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              {getLanguageValue(nimi, language)}
            </Typography>
            <StyledSectionHTML html={getLanguageValue(kuvaus, language)} />
          </Box>

          <AbstractCollapse
            content={
              <OsaamisalaDetails
                osaamisala={osaamisala}
                language={language}
                name={name}
              />
            }
          >
            {({ open, onToggle }) => (
              <OsaamisalaDetailsToggle
                open={open}
                onToggle={onToggle}
                {...getTestIdProps(`osaamisalaToggle.${uri}`)}
              />
            )}
          </AbstractCollapse>
        </Box>
        {index < activeOsaamisalat.length - 1 ? (
          <Divider marginTop={3} marginBottom={3} />
        ) : null}
      </div>
    );
  });
};

const CheckboxGroupWithError = props => {
  return <CheckboxGroup {...props} error={true} />;
};

const CheckboxWithErrorField = createFormFieldComponent(
  CheckboxGroupWithError,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

const OsaamisalatCheckboxGroup = createFormFieldComponent(
  CheckboxGroup,
  ({ input, ...props }) => ({
    ...input,
    ...props,
    keepOldValuesOnChange: true,
  })
);

const OsaamisalatContainer = ({
  peruste,
  koulutus,
  organisaatioOid,
  language,
  name,
  osaamisalatValue,
}) => {
  const { nimi, osaamisalat, id } = peruste;
  const { t } = useTranslation();
  const urls = useUrls();

  const osaamisalaOptions = useMemo(
    () =>
      osaamisalat.map(({ nimi, uri }) => ({
        label: getLanguageValue(nimi, language),
        value: uri,
      })),
    [osaamisalat, language]
  );

  const { koodiArvo } = parseKoodiUri(
    _.get(koulutus, 'koulutuksetKoodiUri')[0]
  );

  const koulutusLinkText = `${getLanguageValue(
    _.get(koulutus, 'nimi'),
    language
  )} (${koodiArvo})`;

  const ePerusteLinkText = `${getLanguageValue(nimi, language)} (${id})`;
  return (
    <>
      {_.isEmpty(osaamisalaOptions) ? (
        <Typography>
          <Trans
            i18nKey="toteutuslomake.eiOsaamisaloja"
            values={{ koulutusLinkText, ePerusteLinkText }}
            components={[
              <RouterAnchor
                to={`/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/muokkaus`}
              >
                {koulutusLinkText}
              </RouterAnchor>,
              <Anchor href={urls.url('eperusteet.kooste', language, id)}>
                {ePerusteLinkText}
              </Anchor>,
            ]}
          />
        </Typography>
      ) : (
        <>
          <SelectionContainer>
            <Typography variant="h6" marginBottom={1}></Typography>
            <FieldGroup
              title={t('toteutuslomake.valitseOsaamisalat')}
              {...getTestIdProps('osaamisalaSelection')}
            >
              <Field
                name={`${name}.osaamisalat`}
                component={OsaamisalatCheckboxGroup}
                options={osaamisalaOptions}
                label={getLanguageValue(nimi, language)}
              />
            </FieldGroup>
          </SelectionContainer>
          <InfoContainer>
            <OsaamisalatInfoFields
              osaamisalatValue={osaamisalatValue || []}
              osaamisalat={osaamisalat}
              language={language}
              name={name}
            />
          </InfoContainer>
        </>
      )}
    </>
  );
};

export const OsaamisalatSection = ({
  language,
  koulutus,
  organisaatioOid,
  name,
  peruste,
}) => {
  const { t } = useTranslation();
  const { osaamisalat } = peruste;

  const osaamisalatValue = useFieldValue(`${name}.osaamisalat`);
  const virheellisetOsaamisalat = useFieldValue(`${name}.osaamisalatWithError`);
  const { data: osaamisalatKoodistodata = [] } = useKoodisto({
    koodisto: 'osaamisala',
  });

  const options = useKoodistoDataOptions({
    koodistoData: osaamisalatKoodistodata,
    lang: language,
  });
  const osaamisalaFieldsValues = _.unionWith(
    osaamisalatValue,
    virheellisetOsaamisalat,
    _.isEqual
  );

  let selectedOsaamisalat;
  if (!_.isEmpty(options)) {
    selectedOsaamisalat = _.map(osaamisalaFieldsValues, uri => {
      const found = _.find(options, option => {
        return option.value.split('#')[0] === uri;
      });

      if (found) {
        return {
          ...found,
          value: found.value.split('#')[0],
        };
      }
    });
  }

  const osaamisalaOptions = useMemo(
    () =>
      osaamisalat.map(({ nimi, uri }) => ({
        label: getLanguageValue(nimi, language),
        value: uri,
      })),
    [osaamisalat, language]
  );

  const osaamisalatNotInEPeruste = _.differenceWith(
    selectedOsaamisalat,
    osaamisalaOptions,
    _.isEqual
  );

  return (
    <>
      <Container>
        {peruste ? (
          <>
            <OsaamisalatContainer
              peruste={peruste}
              koulutus={koulutus}
              language={language}
              name={name}
              organisaatioOid={organisaatioOid}
              osaamisalatValue={osaamisalatValue}
            />
          </>
        ) : (
          <Typography>
            {t('toteutuslomake.koulutuksellaEiEPerustetta')}
          </Typography>
        )}
      </Container>
      {!_.isEmpty(osaamisalatNotInEPeruste) ? (
        <>
          <Divider marginTop={3} marginBottom={3} />
          <>
            <Typography variant="h6" marginBottom={1}>
              {t('toteutuslomake.virheellinenOsaamisalaValinta')}:
            </Typography>
            <Field
              name={`${name}.osaamisalatWithError`}
              component={CheckboxWithErrorField}
              options={osaamisalatNotInEPeruste}
            />
          </>
        </>
      ) : null}
    </>
  );
};
