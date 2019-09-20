import React from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';

import Spacing from '../Spacing';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';

import {
  FormFieldRadioGroup,
  FormFieldYearSelect,
  FormFieldCheckbox,
} from '../formFields';

import useKoodiNimi from '../useKoodiNimi';
import Typography from '../Typography';
import { getTestIdProps } from '../../utils';
import useFieldValue from '../useFieldValue';

const EriAlkamiskausiFields = ({ name, options, t }) => (
  <>
    <Spacing marginBottom={2} marginTop={2}>
      <Field
        name={`${name}.kausi`}
        component={FormFieldRadioGroup}
        options={options}
        label={t('yleiset.kausi')}
      />
    </Spacing>
    <Spacing>
      <Field
        name={`${name}.vuosi`}
        component={FormFieldYearSelect}
        label={t('yleiset.vuosi')}
      />
    </Spacing>
  </>
);

const AlkamiskausiSection = ({ name, toteutus }) => {
  const { t } = useTranslation();
  const eriAlkamiskausi = useFieldValue(`${name}.eriAlkamiskausi`);
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });

  const toteutusAlkamiskausiKoodiUri = get(
    toteutus,
    'metadata.opetus.alkamiskausiKoodiUri',
  );

  const toteutusAlkamisvuosi = get(toteutus, 'metadata.opetus.alkamisvuosi');
  const { nimi: kausiKoodiNimi } = useKoodiNimi(toteutusAlkamiskausiKoodiUri);

  const toteutuksenAlkaminenContent =
    kausiKoodiNimi && toteutusAlkamisvuosi ? (
      <Typography>
        {t('hakukohdelomake.toteutukseenLiitettyAlkamiskausi')}:{' '}
        <strong>
          {kausiKoodiNimi} {toteutusAlkamisvuosi}
        </strong>
      </Typography>
    ) : (
      <Typography>
        {t('hakukohdelomake.toteutukseenEiOleLiitettyAlkamiskautta')}
      </Typography>
    );

  return (
    <>
      <Spacing marginBottom={2}>{toteutuksenAlkaminenContent}</Spacing>
      <div {...getTestIdProps('eriAlkamiskausi')}>
        <Field name={`${name}.eriAlkamiskausi`} component={FormFieldCheckbox}>
          {t('hakukohdelomake.hakukohteellaEriAlkamiskausi')}
        </Field>
      </div>
      {eriAlkamiskausi && (
        <EriAlkamiskausiFields name={name} options={options} t={t} />
      )}
    </>
  );
};

export default AlkamiskausiSection;
