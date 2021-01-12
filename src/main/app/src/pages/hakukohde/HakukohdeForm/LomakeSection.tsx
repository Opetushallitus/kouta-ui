import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { LomakeFields } from '#/src/components/LomakeFields';
import { FormFieldSwitch } from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { HAKULOMAKETYYPPI } from '#/src/constants';
import { Typography } from '#/src/components/virkailija';
import Anchor from '#/src/components/Anchor';
import { useUrls } from '#/src/contexts/contextHooks';
import { InlineInfoBox } from '#/src/components/InlineInfoBox';

const hakulomakeTyyppiToLabel = {
  [HAKULOMAKETYYPPI.MUU]: 'hakukohdelomake.hakuunLiitettyMuuLomake',
  [HAKULOMAKETYYPPI.ATARU]:
    'hakukohdelomake.hakuunLiitettyHakemuspalvelunLomake',
};

const HakulomakeInfo = ({ haku, t }) => {
  const apiUrls = useUrls();
  const hakulomaketyyppi = haku?.hakulomaketyyppi;
  const hakulomakeId = haku?.hakulomakeAtaruId;

  const hakulomakeLinkki = getFirstLanguageValue(haku?.hakulomakeLinkki, 'fi');

  let link;

  if (hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU && hakulomakeId) {
    link = apiUrls.url('lomake-editori.muokkaus-sivu', hakulomakeId);
  } else if (hakulomaketyyppi === HAKULOMAKETYYPPI.MUU && hakulomakeLinkki) {
    link = hakulomakeLinkki;
  }
  const label = hakulomaketyyppi
    ? hakulomakeTyyppiToLabel[hakulomaketyyppi]
    : undefined;

  return label ? (
    <InlineInfoBox
      title={`${t('hakukohdelomake.hakuunLiitettyLomake')}:`}
      iconType="insert_drive_file"
      value={
        <>
          {link ? (
            <Anchor target="_blank" rel="noopener noreferrer" href={link}>
              {t(label)}
            </Anchor>
          ) : (
            t(label)
          )}
        </>
      }
    />
  ) : (
    <Typography>{t('hakukohdelomake.hakuunEiOleLiitettyLomaketta')}</Typography>
  );
};

const ConditionalLomakeFields = ({
  input: { value },
  fieldsName,
  language,
}) => {
  return value ? (
    <Spacing marginTop={2}>
      <LomakeFields name={fieldsName} language={language} />
    </Spacing>
  ) : null;
};

const LomakeSection = ({ language, haku }) => {
  const { t } = useTranslation();
  const haunHakulomaketyyppi = haku?.hakulomaketyyppi;
  const canSelectHakulomake = haunHakulomaketyyppi === HAKULOMAKETYYPPI.MUU;

  return (
    <>
      <Spacing marginBottom={2}>
        <HakulomakeInfo haku={haku} t={t} />
      </Spacing>
      <div {...getTestIdProps('eriHakulomake')}>
        <Field
          name="hakulomake.eriHakulomake"
          component={FormFieldSwitch}
          disabled={!canSelectHakulomake}
          helperText={
            !canSelectHakulomake
              ? t('hakukohdelomake.hakuunEiLiitettyMuuLomake')
              : null
          }
        >
          {t('hakukohdelomake.eriHakulomake')}
        </Field>
      </div>
      {canSelectHakulomake ? (
        <Field
          component={ConditionalLomakeFields}
          name="hakulomake.eriHakulomake"
          fieldsName="hakulomake"
          language={language}
        />
      ) : null}
    </>
  );
};

export default LomakeSection;
