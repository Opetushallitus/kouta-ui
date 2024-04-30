import React, { useEffect } from 'react';

import { TFunction } from 'i18next';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor } from '#/src/components/formFields';
import { parseEditorState } from '#/src/components/LexicalEditorUI/utils';
import { Box } from '#/src/components/virkailija';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { useOsaamismerkki } from '#/src/hooks/useEPeruste/useOsaamismerkki';
import { sanitizeHTML } from '#/src/utils';
import { getLanguageValue } from '#/src/utils/languageUtils';

import {
  Osaamismerkki,
  OsaamismerkkiKuvaus,
} from '../../koulutus/KoulutusForm/TiedotSection/OsaamismerkkiField';

export const ToteutuksenKuvausSection = ({ language }) => {
  const { t } = useTranslation();

  return (
    <Box mb={2}>
      <Field
        name={`kuvaus.${language}`}
        component={FormFieldEditor}
        label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
        required
      />
    </Box>
  );
};

const mapItems = (
  items: Array<OsaamismerkkiKuvaus> = [],
  itemKey: string,
  language: LanguageCode
) => {
  return items
    .map(
      item =>
        `<li>${sanitizeHTML(getLanguageValue(item[itemKey], language))}</li>`
    )
    .join('');
};

export const createKuvausListElement = (
  kuvausItems: Array<OsaamismerkkiKuvaus> = [],
  heading: string,
  itemKey: string,
  language: LanguageCode
): string => {
  if (!isEmpty(kuvausItems)) {
    return `<h3>${heading}</h3><ul>${mapItems(
      kuvausItems,
      itemKey,
      language
    )}</ul>`;
  }

  return '';
};

export const createKuvaus = (
  language: LanguageCode,
  t: TFunction,
  osaamismerkkiData?: Osaamismerkki
): string => {
  if (!isEmpty(osaamismerkkiData)) {
    const osaamistavoitteet = createKuvausListElement(
      osaamismerkkiData?.osaamistavoitteet,
      t('osaamismerkki.osaamistavoitteet'),
      'osaamistavoite',
      language
    );
    const arviointikriteerit = createKuvausListElement(
      osaamismerkkiData?.arviointikriteerit,
      t('osaamismerkki.arviointikriteerit'),
      'arviointikriteeri',
      language
    );

    return osaamistavoitteet + arviointikriteerit;
  }
  return '';
};

const useKuvausFromEPerusteet = (
  osaamismerkkiId: string | undefined,
  name: string,
  language: LanguageCode,
  t: TFunction
) => {
  const { data: osaamismerkkiData = {}, isLoading: osaamismerkkiIsLoading } =
    useOsaamismerkki(osaamismerkkiId);

  const { change } = useBoundFormActions();
  const currKuvaus = useFieldValue(`${name}`);

  useEffect(() => {
    if (isEmpty(currKuvaus) && !osaamismerkkiIsLoading) {
      change(`${name}`, {
        fi: parseEditorState(createKuvaus('fi', t, osaamismerkkiData)),
        sv: parseEditorState(createKuvaus('sv', t, osaamismerkkiData)),
        en: parseEditorState(createKuvaus('en', t, osaamismerkkiData)),
      });
    }
  }, [
    change,
    currKuvaus,
    language,
    name,
    osaamismerkkiData,
    osaamismerkkiIsLoading,
    t,
  ]);
};

export const OsaamismerkkiToteutuksenKuvausSection = ({
  koulutus,
  name,
  language,
}: {
  koulutus: any;
  name: string;
  language: LanguageCode;
}) => {
  const { t } = useTranslation();

  const osaamismerkkiId = koulutus?.metadata?.osaamismerkkiKoodiUri;
  useKuvausFromEPerusteet(osaamismerkkiId, name, language, t);

  return (
    <Box mb={2}>
      <Field
        name={`kuvaus.${language}`}
        component={FormFieldEditor}
        label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
        required
      />
    </Box>
  );
};
