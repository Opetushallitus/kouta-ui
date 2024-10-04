import React from 'react';

import { TFunction } from 'i18next';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Heading } from '#/src/components/Heading';
import { Box, Spin, Typography } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { useOsaamismerkki } from '#/src/hooks/useEPeruste/useOsaamismerkki';
import { sanitizeHTML } from '#/src/utils';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { StyledInfoBox } from './AmmatillinenTiedotSection/InfoBox';
import { OsaamismerkkiKuvaus } from './TiedotSection/OsaamismerkkiField';

export const OsaamismerkkiKuvaukset = ({
  osaamistavoitteet,
  arviointikriteerit,
  language,
  t,
}: {
  osaamistavoitteet: Array<OsaamismerkkiKuvaus>;
  arviointikriteerit: Array<OsaamismerkkiKuvaus>;
  language: LanguageCode;
  t: TFunction;
}) => {
  return (
    <Box mb={2}>
      <StyledInfoBox mb={2}>
        <OsaamismerkkiKuvausSubsection
          entities={osaamistavoitteet}
          entityKey={'osaamistavoite'}
          translationKey={'osaamistavoitteet'}
          language={language}
          t={t}
        />
        <OsaamismerkkiKuvausSubsection
          entities={arviointikriteerit}
          entityKey={'arviointikriteeri'}
          translationKey={'arviointikriteerit'}
          language={language}
          t={t}
        />
      </StyledInfoBox>
    </Box>
  );
};

const OsaamismerkkiKuvausSubsection = ({
  entities,
  entityKey,
  translationKey,
  language,
  t,
}: {
  entities: Array<OsaamismerkkiKuvaus>;
  entityKey: string;
  translationKey: string;
  language: LanguageCode;
  t: TFunction;
}) => {
  return (
    <Box mb={2}>
      <Heading>
        {t(`osaamismerkki.${translationKey}`, { lng: language })}
      </Heading>
      <ul>
        {(entities || []).map((entity, index) => (
          <li key={index}>
            {sanitizeHTML(getLanguageValue(entity[entityKey], language))}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export const OsaamismerkkiKuvausSection = ({
  language,
}: {
  language: LanguageCode;
}) => {
  const { t } = useTranslation();

  const osaamismerkkiId = useFieldValue('information.osaamismerkki')?.value;

  const { data: osaamismerkki = {}, isLoading: osaamismerkkiIsLoading } =
    useOsaamismerkki(osaamismerkkiId);

  const translatedNimi = getLanguageValue(osaamismerkki?.nimi, language);

  const { osaamistavoitteet, arviointikriteerit } = osaamismerkki;

  return osaamismerkkiIsLoading ? (
    <Spin />
  ) : (
    <>
      {isEmpty(osaamismerkki) ? (
        <Typography variant="secondary" as="div">
          {t('koulutuslomake.kuvausEiOleSaatavilla')}
        </Typography>
      ) : (
        <>
          <Typography variant="h4" marginBottom="20px">
            {translatedNimi}{' '}
            <Typography as="span" variant="body">
              ({osaamismerkki?.id})
            </Typography>
          </Typography>
          <OsaamismerkkiKuvaukset
            osaamistavoitteet={osaamistavoitteet}
            arviointikriteerit={arviointikriteerit}
            language={language}
            t={t}
          />
          <Typography variant="secondary" as="div" marginTop={1}>
            ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
          </Typography>
        </>
      )}
    </>
  );
};
