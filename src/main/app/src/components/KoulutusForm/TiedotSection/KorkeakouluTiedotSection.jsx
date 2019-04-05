import React from 'react';
import { Field } from 'redux-form';

import KoulutusSelect from '../KoulutusSelect';
import Typography from '../../Typography';
import Spacing from '../../Spacing';
import Input from '../../Input';
import TutkintoNimikeSelect from './TutkintonimikeSelect';
import useKoodistoOptions from '../../useKoodistoOptions';
import Select from '../../Select';
import useTranslation from '../../useTranslation';
import { getTestIdProps } from '../../../utils';

const noop = () => {};

const renderKoulutusField = ({ input, koulutustyyppi }) => (
  <KoulutusSelect koulutustyyppi={koulutustyyppi} {...input} onBlur={noop} />
);

const renderInputField = ({ input, ...props }) => (
  <Input {...input} {...props} />
);

const renderTutkintoNimikeField = ({ input }) => (
  <TutkintoNimikeSelect {...input} onBlur={noop} />
);

const renderSelectField = ({ input, options }) => (
  <Select {...input} options={options} onBlur={noop} />
);

export const KorkeakoulutuTiedotSection = ({ koulutustyyppi, language }) => {
  const { options: laajuusOptions } = useKoodistoOptions({
    koodisto: 'opintojenlaajuus',
  });

  const { t } = useTranslation();

  return (
    <>
      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          {t('koulutuslomake.valitseKoulutuskoodi')}
        </Typography>
        <div {...getTestIdProps('koulutuskoodiSelect')}>
          <Field
            name="koulutus"
            component={renderKoulutusField}
            koulutustyyppi={koulutustyyppi}
          />
        </div>
      </Spacing>

      <Spacing marginBottom={2} {...getTestIdProps('nimiInput')}>
        <Typography variant="h6" marginBottom={1}>
          {t('koulutuslomake.muokkaaKoulutuksenNimea')}
        </Typography>
        <Field name={`nimi.${language}`} component={renderInputField} />
      </Spacing>

      <Spacing marginBottom={2}>
        <Typography variant="h6" marginBottom={1}>
          {t('koulutuslomake.valitseTutkintonimike')}
        </Typography>
        <div {...getTestIdProps('tutkintonimikeSelect')}>
          <Field name="tutkintonimike" component={renderTutkintoNimikeField} />
        </div>
      </Spacing>

      <Typography variant="h6" marginBottom={1}>
        {t('koulutuslomake.valitseOpintojenLaajuus')}
      </Typography>
      <div {...getTestIdProps('opintojenLaajuusSelect')}>
        <Field
          name="opintojenLaajuus"
          component={renderSelectField}
          options={laajuusOptions}
        />
      </div>
    </>
  );
};

export default KorkeakoulutuTiedotSection;
