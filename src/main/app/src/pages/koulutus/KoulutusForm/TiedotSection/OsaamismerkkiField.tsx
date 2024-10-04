import React, { useEffect } from 'react';

import { TFunction } from 'i18next';
import { isEmpty, lowerCase, some, now } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useUnmount } from 'react-use';
import { Field } from 'redux-form';
import styled, { css } from 'styled-components';

import Anchor from '#/src/components/Anchor';
import { FormFieldSelect } from '#/src/components/formFields';
import { Box, Spin } from '#/src/components/virkailija';
import { OSAAMISMERKKI_JULKAISUTILA } from '#/src/constants';
import { useUrls } from '#/src/contexts/UrlContext';
import {
  useFieldValue,
  useBoundFormActions,
  useIsDirty,
} from '#/src/hooks/form';
import { useOsaamismerkki } from '#/src/hooks/useEPeruste/useOsaamismerkki';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { useKoodistoOptions } from '#/src/hooks/useKoodistoOptions';
import {
  InfoBoxGrid,
  StyledInfoBox,
} from '#/src/pages/koulutus/KoulutusForm/AmmatillinenTiedotSection/InfoBox';
import { SelectFieldProps } from '#/src/types/formTypes';
import {
  formatKoodiLabelWithArvo,
  getReadableDate,
  getTestIdProps,
} from '#/src/utils';
import { getOsaamismerkkiStatusCss } from '#/src/utils/ePeruste/osaamismerkkiStatus';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

type OsaamismerkkiKuvausEntity = {
  _id: string;
  _tunniste: string;
  fi?: string;
  sv?: string;
  en?: string;
};

export type OsaamismerkkiKuvaus = {
  id: number;
  osaamistavoite?: OsaamismerkkiKuvausEntity;
  arviointikriteeri?: OsaamismerkkiKuvausEntity;
};

type OsaamismerkkiNimi = {
  _id: string;
  _tunniste: string;
  fi?: string;
  sv?: string;
  en?: string;
};

type OsaamismerkkiLiite = {
  id: string;
  nimi: string;
  mime: string;
  binarydata: string;
};

export type Osaamismerkki = {
  id: number;
  nimi: OsaamismerkkiNimi;
  kuvaus: string | null;
  tila: OSAAMISMERKKI_JULKAISUTILA;
  kategoria: {
    id: number;
    nimi: OsaamismerkkiNimi;
    kuvaus: string | null;
    liite: OsaamismerkkiLiite;
    muokattu: number;
  };
  koodiUri: string;
  osaamistavoitteet: Array<OsaamismerkkiKuvaus>;
  arviointikriteerit: Array<OsaamismerkkiKuvaus>;
  voimassaoloAlkaa: number;
  voimassaoloLoppuu: number | null;
  muokattu: number;
  muokkaaja: string;
};

export const TilaBadge = ({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className={className}>
        {isEmpty(status) ? '-' : t(`julkaisutilat.${lowerCase(status) ?? ''}`)}
      </div>
    </div>
  );
};

const StyledTilaBadge = styled(TilaBadge)`
  ${props => {
    if (!isEmpty(props.status)) {
      return css`
        display: inline-block;
        padding: 1px 10px;
        font-weight: bold;
        ${getOsaamismerkkiStatusCss}
      `;
    }
  }}
`;

export const OsaamismerkkiVoimassaoloLoppunut = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <div>
      <div className={className}>{text}</div>
    </div>
  );
};

const StyledOsaamismerkkiVoimassaoloLoppunut = styled(
  OsaamismerkkiVoimassaoloLoppunut
).attrs({ type: 'error' })`
  color: ${({ theme }) => theme.colors.red.main};
`;
const OsaamismerkkitiedotReadOnly = ({
  osaamismerkkiData,
  t,
  language,
}: {
  osaamismerkkiData: Osaamismerkki;
  t: TFunction;
  language: string;
}) => {
  const apiUrls = useUrls();

  const logo = osaamismerkkiData?.kategoria?.liite?.binarydata;

  const voimassaoloLoppuu = osaamismerkkiData?.voimassaoloLoppuu;
  const isDeprecated = voimassaoloLoppuu < now();
  const voimassaoloLoppuuRow =
    voimassaoloLoppuu && isDeprecated
      ? {
          title: t('yleiset.voimassaoloLoppuu'),
          description: (
            <StyledOsaamismerkkiVoimassaoloLoppunut
              text={`${t(
                'osaamismerkki.voimassaoloLoppunut'
              )} ${getReadableDate(osaamismerkkiData?.voimassaoloLoppuu)}`}
            />
          ),
        }
      : null;
  return (
    <Box>
      <InfoBoxGrid
        rows={[
          {
            title: t('koulutuslomake.linkkiEPerusteisiin'),
            description: (
              <Anchor
                href={apiUrls.url(
                  'eperusteet.osaamismerkit',
                  language,
                  osaamismerkkiData?.id
                )}
                target="_blank"
              >
                {osaamismerkkiData?.id}
              </Anchor>
            ),
          },
          {
            title: t('yleiset.voimaantulo'),
            description: getReadableDate(osaamismerkkiData?.voimassaoloAlkaa),
          },
          voimassaoloLoppuuRow,
          {
            title: t('yleiset.tila'),
            description: <StyledTilaBadge status={osaamismerkkiData?.tila} />,
          },
          {
            title: t('yleiset.kategoria'),
            description: getFirstLanguageValue(
              osaamismerkkiData?.kategoria?.nimi,
              language
            ),
          },
          {
            title: t('osaamismerkki.logo'),
            description: (
              <img
                src={`data:image/png;base64,${logo}`}
                alt={t('osaamismerkki.logo')}
              />
            ),
          },
        ]}
      />
    </Box>
  );
};

export const updateOptionsWithMaybeDeprecatedOsaamismerkki = (
  options: Array<SelectOptions>,
  osaamismerkkiId: string,
  osaamismerkkidata: Osaamismerkki,
  language: LanguageCode
) => {
  const alreadyExists = some(options, ({ value }) => {
    return (
      koodiUriWithoutVersion(value) === koodiUriWithoutVersion(osaamismerkkiId)
    );
  });

  return osaamismerkkiId && osaamismerkkidata?.nimi && !alreadyExists
    ? options.concat([
        {
          value: osaamismerkkiId,
          label: getFirstLanguageValue(osaamismerkkidata.nimi, language),
        },
      ])
    : options;
};

export const OsaamismerkkiField = (props: SelectFieldProps) => {
  const { t } = useTranslation();
  const {
    name,
    isMultiSelect = false,
    language,
    koulutustyyppi: selectedKoulutus,
  } = props;

  const { options, isLoading } = useKoodistoOptions({
    koodisto: 'osaamismerkit',
    language: language,
  });

  const osaamismerkkiId = useFieldValue(name)?.value;

  const { data: osaamismerkkiData, isLoading: osaamismerkkiIsLoading } =
    useOsaamismerkki(osaamismerkkiId);

  const optionsWithMaybeDeprecatedOsaamismerkki =
    updateOptionsWithMaybeDeprecatedOsaamismerkki(
      options,
      osaamismerkkiId,
      osaamismerkkiData,
      language
    );

  const { change } = useBoundFormActions();
  const isDirty = useIsDirty();

  const koulutusHasChanged = useHasChanged(selectedKoulutus);

  useEffect(() => {
    if (isDirty && koulutusHasChanged) {
      change(name, null);
    }
  }, [change, isDirty, name, koulutusHasChanged]);

  useUnmount(() => {
    change(name, null);
  });

  return osaamismerkkiIsLoading ? (
    <Spin />
  ) : (
    <StyledInfoBox mb={2}>
      <Box width={0.7} mb={2} {...getTestIdProps('osaamismerkkiSelect')}>
        <Field
          isLoading={isLoading}
          component={FormFieldSelect}
          options={optionsWithMaybeDeprecatedOsaamismerkki}
          label={t('koulutuslomake.valitseOsaamismerkki')}
          showAllOptions={true}
          isMulti={isMultiSelect}
          formatKoodiLabel={formatKoodiLabelWithArvo}
          required
          {...props}
        />
      </Box>
      {osaamismerkkiId && (
        <OsaamismerkkitiedotReadOnly
          osaamismerkkiData={osaamismerkkiData}
          language={language}
          t={t}
        />
      )}
    </StyledInfoBox>
  );
};
