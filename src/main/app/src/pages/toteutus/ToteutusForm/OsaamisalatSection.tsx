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
  FormFieldCheckboxGroup,
  FormFieldUrlInput,
} from '#/src/components/formFields';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import {
  Box,
  Divider,
  Icon,
  Typography,
  Spin,
} from '#/src/components/virkailija';
import { useUrls } from '#/src/contexts/UrlContext';
import { useFieldValue } from '#/src/hooks/form';
import { getThemeProp } from '#/src/theme';
import { sanitizeHTML } from '#/src/utils';
import { getTestIdProps } from '#/src/utils';
import { useEPerusteById } from '#/src/utils/ePeruste/getEPerusteById';
import { useEPerusteOsaamisalaKuvaukset } from '#/src/utils/ePeruste/getOsaamisalakuvauksetByEPerusteId';
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

const OsaamisalatContainer = ({
  peruste,
  koulutus,
  organisaatioOid,
  language,
  name,
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

  const osaamisalatValue = useFieldValue(`${name}.osaamisalat`);
  const koulutusLinkText = `${getLanguageValue(
    _.get(koulutus, 'nimi'),
    language
  )} (${koodiArvo})`;

  const ePerusteLinkText = `${getLanguageValue(nimi, language)} (${id})`;
  return _.isEmpty(osaamisalat) ? (
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
            component={FormFieldCheckboxGroup}
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
  );
};

const useExtendedEPeruste = ePerusteId => {
  const { data: ePeruste, isLoading: ePerusteLoading } =
    useEPerusteById(ePerusteId);
  const { data: osaamisalaKuvaukset, isLoading: osaamisalaKuvauksetLoading } =
    useEPerusteOsaamisalaKuvaukset({ ePerusteId });

  const osaamisalat = ePeruste?.osaamisalat;

  const osaamisalatWithDescriptions = useMemo(
    () =>
      _.map(osaamisalat, osaamisala => ({
        ...osaamisala,
        kuvaus: _.mapValues(
          _.get(osaamisalaKuvaukset, [osaamisala.uri, 0, 'teksti']) || {},
          v => (_.isString(v) ? sanitizeHTML(v) : v)
        ),
      })),
    [osaamisalat, osaamisalaKuvaukset]
  );

  return {
    data: ePeruste
      ? { ...ePeruste, osaamisalat: osaamisalatWithDescriptions }
      : null,
    isLoading: ePerusteLoading || osaamisalaKuvauksetLoading,
  };
};

export const OsaamisalatSection = ({
  language,
  koulutus,
  organisaatioOid,
  name,
}) => {
  const { t } = useTranslation();
  const { ePerusteId } = koulutus || {};
  const { data: ePeruste, isLoading } = useExtendedEPeruste(ePerusteId);

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
