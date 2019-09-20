import React, { useContext } from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';

import LomakeFields from '../LomakeFields';
import { FormFieldCheckbox } from '../formFields';
import useTranslation from '../useTranslation';
import Spacing from '../Spacing';
import { getTestIdProps } from '../../utils';
import { HAKULOMAKETYYPPI } from '../../constants';
import UrlContext from '../UrlContext';
import Typography from '../Typography';
import Anchor from '../Anchor';

const HakulomakeInfo = ({ haku, t }) => {
  const apiUrls = useContext(UrlContext);
  const hakulomaketyyppi = get(haku, 'hakulomaketyyppi');
  const hakulomakeId = get(haku, 'hakulomakeId');
  const hakulomakeLinkki = get(haku, 'hakulomakeLinkki');

  let link;

  if (hakulomaketyyppi === HAKULOMAKETYYPPI.ATARU && hakulomakeId) {
    link = apiUrls.url('lomake-editori.muokkaus-sivu', hakulomakeId);
  } else if (hakulomaketyyppi === HAKULOMAKETYYPPI.MUU && hakulomakeLinkki) {
    link = hakulomakeLinkki;
  }

  return link ? (
    <Typography>
      {t('hakukohdelomake.hakuunLiitettyLomake')}:{' '}
      <Anchor target="_blank" rel="noopener noreferrer" href={link}>
        {t('hakukohdelomake.avaaLomake')}
      </Anchor>
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

  return (
    <>
      <Spacing marginBottom={2}>
        <HakulomakeInfo haku={haku} t={t} />
      </Spacing>
      <div {...getTestIdProps('eriHakulomake')}>
        <Field name="hakulomake.eriHakulomake" component={FormFieldCheckbox}>
          {t('hakukohdelomake.eriHakulomake')}
        </Field>
      </div>
      <Field
        component={ConditionalLomakeFields}
        name="hakulomake.eriHakulomake"
        fieldsName="hakulomake"
        language={language}
      />
    </>
  );
};

export default LomakeSection;
