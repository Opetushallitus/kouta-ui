import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import styled from 'styled-components';
import stripTags from 'striptags';
import { get, isEmpty, isString, mapValues } from 'lodash';
import { Trans } from 'react-i18next';
import {
  getOsaamisalakuvauksetByPerusteId,
  getEPerusteById,
} from '#/src/apiUtils';
import { getThemeProp } from '#/src/theme';
import { getLanguageValue, getTestIdProps } from '#/src/utils';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';

import Anchor from '#/src/components/Anchor';
import AbstractCollapse from '#/src/components/AbstractCollapse';
import Checkbox from '#/src/components/Checkbox';
import Divider from '#/src/components/Divider';
import { FormFieldInput } from '#/src/components/formFields';
import Icon from '#/src/components/Icon';
import LocalLink from '#/src/components/LocalLink';
import Spacing from '#/src/components/Spacing';
import Spin from '#/src/components/Spin';
import Typography from '#/src/components/Typography';

import { useURLs } from '#/src/hooks/context';
import useTranslation from '#/src/components/useTranslation';
import useFieldValue from '#/src/components/useFieldValue';
import useApiAsync from '#/src/components/useApiAsync';

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
  return (
    <OsaamisalaDetailsToggleContainer onClick={onToggle} {...props}>
      <Icon type={open ? 'arrow_drop_down' : 'arrow_right'} />
      <Typography>
        {open ? 'Sulje tarkempi kuvaus' : 'Tarkenna kuvausta'}
      </Typography>
    </OsaamisalaDetailsToggleContainer>
  );
};

const makeOnCheckboxChange = ({ value, onChange, optionValue }) => e => {
  if (e.target.checked) {
    onChange([...value, optionValue]);
  } else {
    onChange(value.filter(v => v !== optionValue));
  }
};

const getExtendedEPeruste = async ({ httpClient, apiUrls, ePerusteId }) => {
  if (!ePerusteId) {
    return null;
  }

  const ePeruste = await getEPerusteById({
    httpClient,
    apiUrls,
    ePerusteId,
  });

  const { osaamisalat } = ePeruste;

  const osaamisalakuvaukset = await getOsaamisalakuvauksetByPerusteId({
    httpClient,
    apiUrls,
    ePerusteId,
  });

  const osaamisalatWithDescriptions = osaamisalat.map(osaamisala => ({
    ...osaamisala,
    kuvaus: mapValues(
      get(osaamisalakuvaukset, [osaamisala.uri, 0, 'teksti']) || {},
      v => (isString(v) ? stripTags(v) : v),
    ),
  }));

  return {
    ...ePeruste,
    osaamisalat: osaamisalatWithDescriptions,
  };
};

const OsaamisalaSelection = ({
  options = [],
  onChange = () => {},
  value = [],
}) => (
  <div {...getTestIdProps('osaamisalaSelection')}>
    {options.map(({ value: optionValue, label }) => (
      <div>
        <Checkbox
          key={optionValue}
          name={optionValue}
          checked={value.includes(optionValue)}
          onChange={makeOnCheckboxChange({ value, onChange, optionValue })}
        >
          {label}
        </Checkbox>
      </div>
    ))}
  </div>
);

const renderOsaamisalaSelectionField = ({ input, options }) => {
  return <OsaamisalaSelection {...input} options={options} />;
};

const OsaamisalaDetails = ({ osaamisala, language, name }) => {
  const { t } = useTranslation();

  return (
    <Spacing marginTop={2}>
      <Spacing
        marginBottom={2}
        {...getTestIdProps(`osaamisalaLinkki.${osaamisala.uri}`)}
      >
        <Field
          name={`${name}.osaamisalaLinkit.${osaamisala.uri}.${language}`}
          component={FormFieldInput}
          label={t('yleiset.linkki')}
        />
      </Spacing>
      <Spacing {...getTestIdProps(`osaamisalaOtsikko.${osaamisala.uri}`)}>
        <Field
          name={`${name}.osaamisalaLinkkiOtsikot.${osaamisala.uri}.${language}`}
          component={FormFieldInput}
          label={t('yleiset.linkinOtsikko')}
        />
      </Spacing>
    </Spacing>
  );
};

const OsaamisalatInfoFields = ({
  osaamisalatValue,
  osaamisalat,
  language,
  name,
}) => {
  const activeOsaamisalat = osaamisalat.filter(({ uri }) =>
    osaamisalatValue.includes(uri),
  );

  return activeOsaamisalat.map((osaamisala, index) => {
    const { nimi, kuvaus, uri } = osaamisala;

    return (
      <div key={uri}>
        <Spacing key={uri}>
          <Spacing marginBottom={2}>
            <Typography variant="h6" marginBottom={1}>
              {getLanguageValue(nimi, language)}
            </Typography>
            <Typography>{getLanguageValue(kuvaus, language)}</Typography>
          </Spacing>

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
        </Spacing>
        {index < activeOsaamisalat.length - 1 ? (
          <Divider marginTop={3} marginBottom={3} />
        ) : null}
      </div>
    );
  });
};

const OsaamisalatContainer = ({
  peruste,
  koulutus,
  organisaatioOid,
  language,
  name,
}) => {
  const { nimi, osaamisalat, id } = peruste;
  const urls = useURLs();

  const osaamisalaOptions = useMemo(
    () =>
      osaamisalat.map(({ nimi, uri }) => ({
        label: getLanguageValue(nimi, language),
        value: uri,
      })),
    [osaamisalat, language],
  );
  const { koodiArvo } = parseKoodiUri(get(koulutus, 'koulutusKoodiUri'));

  const osaamisalatValue = useFieldValue(`${name}.osaamisalat`);
  const koulutusLinkText = `${getLanguageValue(
    get(koulutus, 'nimi'),
    language,
  )} (${koodiArvo})`;

  const ePerusteLinkText = `${getLanguageValue(nimi, language)} (${id})`;
  return isEmpty(osaamisalat) ? (
    <Typography>
      <Trans
        i18nKey="toteutuslomake.eiOsaamisaloja"
        values={{ koulutusLinkText, ePerusteLinkText }}
        components={[
          <LocalLink
            to={`/organisaatio/${organisaatioOid}/koulutus/${koulutus.oid}/muokkaus`}
          >
            {koulutusLinkText}
          </LocalLink>,
          <Anchor href={urls.url('eperusteet.kooste', language, id)}>
            {ePerusteLinkText}
          </Anchor>,
        ]}
      />
    </Typography>
  ) : (
    <>
      <SelectionContainer>
        <Typography variant="h6" marginBottom={1}>
          {getLanguageValue(nimi, language)}
        </Typography>
        <Field
          name={`${name}.osaamisalat`}
          component={renderOsaamisalaSelectionField}
          options={osaamisalaOptions}
        />
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
  );
};

const OsaamisalatSection = ({ language, koulutus, organisaatioOid, name }) => {
  const { t } = useTranslation();
  const { ePerusteId } = koulutus;
  const { data: ePeruste, isLoading } = useApiAsync({
    promiseFn: getExtendedEPeruste,
    ePerusteId,
    watch: ePerusteId,
  });

  return (
    <Container>
      {isLoading ? (
        <Spin />
      ) : ePeruste ? (
        <OsaamisalatContainer
          peruste={ePeruste}
          koulutus={koulutus}
          language={language}
          name={name}
          organisaatioOid={organisaatioOid}
        />
      ) : (
        <Typography>
          {t('toteutuslomake.koulutuksellaEiEPerustetta')}
        </Typography>
      )}
    </Container>
  );
};

export default OsaamisalatSection;
