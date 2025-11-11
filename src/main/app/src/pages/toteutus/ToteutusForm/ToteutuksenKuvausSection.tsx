import { useCallback, useEffect, useState } from 'react';

import { TFunction } from 'i18next';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import DeleteConfirmationDialog from '#/src/components/DeleteConfirmationDialog';
import { FormButton } from '#/src/components/FormButton';
import { FormFieldEditor } from '#/src/components/formFields';
import {
  isEditorEmpty,
  parseEditorState,
} from '#/src/components/LexicalEditorUI/utils';
import { Box, FormLabel } from '#/src/components/virkailija';
import { useBoundFormActions, useFieldValue } from '#/src/hooks/form';
import { useOsaamismerkki } from '#/src/hooks/useEPeruste/useOsaamismerkki';
import { KoulutusModel } from '#/src/types/domainTypes';
import { sanitizeHTML } from '#/src/utils';
import { getLanguageValue } from '#/src/utils/languageUtils';

import {
  Osaamismerkki,
  OsaamismerkkiKuvaus,
} from '../../koulutus/KoulutusForm/TiedotSection/OsaamismerkkiField';

export const ToteutuksenKuvausSection = ({
  language,
  name,
}: {
  language: string;
  name: string;
}) => {
  const { t } = useTranslation();

  return (
    <Box mb={2}>
      <Field
        name={`${name}.kuvaus.${language}`}
        component={FormFieldEditor}
        label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
        required
      />
    </Box>
  );
};

export const ToteutuksenKuvausJaOsaamistavoitteetSection = ({
  language,
  name,
  koulutus,
}: {
  language: string;
  name: string;
  koulutus: KoulutusModel;
}) => {
  const { t } = useTranslation();
  const { change } = useBoundFormActions();
  const currOsaamistavoitteet = useFieldValue(
    `${name}.osaamistavoitteet.${language}`
  );
  const isOsaamistavoitteetEditorEmpty = isEditorEmpty(currOsaamistavoitteet);
  const koulutuksenOsaamistavoitteet = koulutus?.metadata?.osaamistavoitteet;

  const [isConfirmationDialogOpen, toggleConfirmationDialog] = useState(false);

  const doReplaceOsaamistavoitteet = () => {
    toggleConfirmationDialog(false);
    change(
      `${name}.osaamistavoitteet.${language}`,
      parseEditorState(koulutuksenOsaamistavoitteet?.[language] || '')
    );
  };

  const copyOsaamistavoitteetFromKoulutus = useCallback(() => {
    if (isOsaamistavoitteetEditorEmpty) {
      change(
        `${name}.osaamistavoitteet.${language}`,
        parseEditorState(koulutuksenOsaamistavoitteet?.[language] || '')
      );
    } else {
      toggleConfirmationDialog(true);
    }
  }, [
    change,
    isOsaamistavoitteetEditorEmpty,
    koulutuksenOsaamistavoitteet,
    language,
    name,
  ]);

  return (
    <>
      <Box mb={2}>
        <Field
          name={`${name}.kuvaus.${language}`}
          component={FormFieldEditor}
          label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
          required
        />
      </Box>
      <Box mb={2}>
        <DeleteConfirmationDialog
          isOpen={isConfirmationDialogOpen}
          onConfirm={doReplaceOsaamistavoitteet}
          onCancel={() => {
            toggleConfirmationDialog(false);
          }}
          headerText={t('ilmoitukset.osaamistavoitteet.otsikko')}
          message={t('ilmoitukset.osaamistavoitteet.viesti')}
        />
        <FormLabel htmlFor="osaamistavoitteet">
          {`${t('yleiset.osaamistavoitteet')} *`}
        </FormLabel>
        <FormButton
          variant="outlined"
          color="primary"
          type="button"
          style={{ marginBottom: '1rem' }}
          onClick={copyOsaamistavoitteetFromKoulutus}
          disabled={isEmpty(koulutuksenOsaamistavoitteet)}
        >
          {t('toteutuslomake.kaytaKoulutuksenOsaamistavoitteita')}
        </FormButton>
        <Field
          name={`${name}.osaamistavoitteet.${language}`}
          component={FormFieldEditor}
          required={true}
        />
      </Box>
    </>
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
      t('osaamismerkki.osaamistavoitteet', { lng: language }),
      'osaamistavoite',
      language
    );
    const arviointikriteerit = createKuvausListElement(
      osaamismerkkiData?.arviointikriteerit,
      t('osaamismerkki.arviointikriteerit', { lng: language }),
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
  useKuvausFromEPerusteet(osaamismerkkiId, `${name}.kuvaus`, language, t);

  return (
    <Box mb={2}>
      <Field
        name={`${name}.kuvaus.${language}`}
        component={FormFieldEditor}
        label={t('toteutuslomake.toteutuksenYleinenKuvaus')}
        required
      />
    </Box>
  );
};
