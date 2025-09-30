import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSwitch } from '#/src/components/formFields';
import { Box } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import {
  useFieldValue,
  useInitalFieldValue,
  useIsDirty,
  useSetFieldValue,
} from '#/src/hooks/form';

const JarjestaaUrheilijanAmmatillistaKoulutustaField = ({
  options,
  koulutustyyppi,
}) => {
  const { t } = useTranslation();
  const jarjestyspaikkaOid = useFieldValue('jarjestyspaikkaOid');
  const initialJarjestyspaikkaOid = useInitalFieldValue('jarjestyspaikkaOid');
  const jarjestyspaikka = options.find(
    option => option.value === jarjestyspaikkaOid
  );
  const isDirty = useIsDirty();
  const jarjestaaUrheilijanAmmKoulutusta = useFieldValue(
    'jarjestaaUrheilijanAmmKoulutusta'
  );
  const hasJarjestyspaikkaChanged =
    jarjestyspaikkaOid !== initialJarjestyspaikkaOid && isDirty;
  useSetFieldValue(
    'jarjestaaUrheilijanAmmKoulutusta',
    false,
    hasJarjestyspaikkaChanged &&
      !jarjestyspaikka.jarjestaaUrheilijanAmmKoulutusta
  );

  const isUrheilijanAmmKoulutusFieldVisible =
    koulutustyyppi === KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS &&
    (jarjestaaUrheilijanAmmKoulutusta === true ||
      jarjestyspaikka?.jarjestaaUrheilijanAmmKoulutusta === true);

  return isUrheilijanAmmKoulutusFieldVisible ? (
    <Box mt={3} mb={3}>
      <Field
        component={FormFieldSwitch}
        name="jarjestaaUrheilijanAmmKoulutusta"
        disabled={!jarjestyspaikka.jarjestaaUrheilijanAmmKoulutusta}
      >
        {t('hakukohdelomake.jarjestaaUrheilijanAmmKoulutusta')}
      </Field>
    </Box>
  ) : null;
};

export default JarjestaaUrheilijanAmmatillistaKoulutustaField;
