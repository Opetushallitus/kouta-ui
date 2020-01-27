import React from 'react';
import {Field} from 'redux-form';

import {getTestIdProps} from '../../../utils';
import useTranslation from '../../useTranslation';
import {
  FormFieldCheckbox,
  FormFieldDatePickerInput,
  FormFieldRadioGroup,
  FormFieldYearSelect
} from '../../formFields';
import Box from '../../Box';
import useKoodistoOptions from '../../useKoodistoOptions';
import Spacing from "../../Spacing";
import useFieldValue from "../../useFieldValue";

const TarkkaAlkamiskausiFields = ({name}) => {
  const {t} = useTranslation();
  return <Spacing>
    <Box
      flexGrow="1"
      p={1}
      {...getTestIdProps('koulutuksenAlkamispaivamaara')}
    >
      <Field
        name={`${name}.koulutuksenAlkamispaivamaara`}
        component={FormFieldDatePickerInput}
        label={t('yleiset.alkaa')}
      />
    </Box>
    <Box
      flexGrow="1"
      p={1}
      {...getTestIdProps('koulutuksenPaattymispaivamaara')}
    >
      <Field
        name={`${name}.koulutuksenPaattymispaivamaara`}
        component={FormFieldDatePickerInput}
        label={t('yleiset.paattyy')}
      />
    </Box>
  </Spacing>
};

const KausiJaVuosiFields = ({name}) => {
  const {options} = useKoodistoOptions({koodisto: 'kausi'});
  const {t} = useTranslation();
  return <Spacing>
    <Box
      flexGrow="1"
      p={1}
      {...getTestIdProps('koulutuksenAlkamiskausi')}
    >
      <Field
        name={`${name}.koulutuksenAlkamiskausi`}
        component={FormFieldRadioGroup}
        label={t('toteutuslomake.koulutuksenAlkamiskausi')}
        options={options}
      />
    </Box>
    <Box
      flexGrow="1"
      p={1}
      {...getTestIdProps('koulutuksenAlkamisvuosi')}
    >
      <Field
        name={`${name}.koulutuksenAlkamisvuosi`}
        component={FormFieldYearSelect}
        isClearable
        placeholder={t('toteutuslomake.koulutuksenAlkamisvuosi')}
      />
    </Box>
  </Spacing>;
};

const AlkamiskausiFields = ({name}) => {
  const {t} = useTranslation();
  const koulutuksenTarkkaAlkamisaika = useFieldValue(`${name}.koulutuksenTarkkaAlkamisaika`);
  return (
    <Box display="flex" m={-1}>
      <Spacing>
        <Box
          flexGrow="1"
          p={1}
          {...getTestIdProps('koulutuksenTarkkaAlkamisaika')}
        >
          <Field
            name={`${name}.koulutuksenTarkkaAlkamisaika`}
            component={FormFieldCheckbox}
            label={t('toteutuslomake.koulutuksenTarkkaAlkamisaika')}
          />
        </Box>
      </Spacing>
      {koulutuksenTarkkaAlkamisaika ? <TarkkaAlkamiskausiFields name={name}/> : <KausiJaVuosiFields name={name}/>}
    </Box>
  );
};

export default AlkamiskausiFields;
