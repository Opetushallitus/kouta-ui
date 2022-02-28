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
import { Spin } from '#/src/components/virkailija';
import { Box, Divider, Icon, Typography } from '#/src/components/virkailija';
import { useUrls } from '#/src/contexts/UrlContext';
import { useFieldValue } from '#/src/hooks/form';
import useKoodisto from '#/src/hooks/useKoodisto';
import { getThemeProp } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';
import useExtendedEPeruste from '#/src/utils/ePeruste/useExtendedEPeruste';
import parseKoodiUri from '#/src/utils/koodi/parseKoodiUri';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { OsaamisalatInput } from '../OsaamisalatInput.tsx';

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

const OsaamisalatCheckboxGroup = createFormFieldComponent(
  OsaamisalatInput,
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
  osaamisalatKoodistoData,
}) => {
  const { nimi, osaamisalat, id } = peruste;
  const urls = useUrls();

  const osaamisalatValue = useFieldValue(`${name}.osaamisalat`);
  console.log({ osaamisalatValue });

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
      {_.isEmpty(osaamisalat) && (
        <Typography style={{ display: 'block', marginBottom: '12px' }}>
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
      )}
      <Container>
        <SelectionContainer>
          <Typography variant="h6" marginBottom={1}></Typography>
          <FieldGroup {...getTestIdProps('osaamisalaSelection')}>
            <Field
              name={`${name}.osaamisalat`}
              component={OsaamisalatCheckboxGroup}
              ePeruste={peruste}
              language={language}
              osaamisalatKoodistoData={osaamisalatKoodistoData}
              value={osaamisalatValue}
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
      </Container>
    </>
  );
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

  const { data: osaamisalatKoodistodata = [], isKoodistoLoading } = useKoodisto(
    {
      koodisto: 'osaamisala',
    }
  );

  return isLoading || isKoodistoLoading ? (
    <Spin center />
  ) : (
    <>
      {ePeruste ? (
        <>
          <OsaamisalatContainer
            peruste={ePeruste}
            koulutus={koulutus}
            language={language}
            name={name}
            organisaatioOid={organisaatioOid}
            osaamisalatKoodistoData={osaamisalatKoodistodata}
          />
        </>
      ) : (
        <Typography>
          {t('toteutuslomake.koulutuksellaEiEPerustetta')}
        </Typography>
      )}
    </>
  );
};
