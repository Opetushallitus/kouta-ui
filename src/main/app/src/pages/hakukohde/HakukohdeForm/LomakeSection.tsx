import React from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';

import LomakeFields from '#/src/components/LomakeFields';
import { FormFieldCheckbox } from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { HAKULOMAKETYYPPI } from '#/src/constants';
import Typography from '#/src/components/Typography';
import Anchor from '#/src/components/Anchor';
import { useUrls } from '#/src/contexts/contextHooks';

const hakulomakeTyyppiToLabel = {
  [HAKULOMAKETYYPPI.MUU]: 'hakukohdelomake.hakuunLiitettyMuuLomake',
  [HAKULOMAKETYYPPI.ATARU]:
    'hakukohdelomake.hakuunLiitettyHakemuspalvelunLomake',
};

const HakulomakeInfo = ({ haku, t }) => {
  const apiUrls = useUrls();
  const hakulomaketyyppi = get(haku, 'hakulomaketyyppi');
  const hakulomakeId = get(haku, 'hakulomakeId');

  const hakulomakeLinkki = getFirstLanguageValue(
    get(haku, 'hakulomakeLinkki'),
    'fi'
  );

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
    <Typography>
      {t('hakukohdelomake.hakuunLiitettyLomake')}:{' '}
      <strong>
        {link ? (
          <Anchor target="_blank" rel="noopener noreferrer" href={link}>
            {t(label)}
          </Anchor>
        ) : (
          t(label)
        )}
      </strong>
    </Typography>
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
  const haunHakulomaketyyppi = get(haku, 'hakulomaketyyppi');
  const canSelectHakulomake = haunHakulomaketyyppi === HAKULOMAKETYYPPI.MUU;

  return (
    <>
      <Spacing marginBottom={2}>
        <HakulomakeInfo haku={haku} t={t} />
      </Spacing>
      <div {...getTestIdProps('eriHakulomake')}>
        <Field
          name="hakulomake.eriHakulomake"
          component={FormFieldCheckbox}
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
