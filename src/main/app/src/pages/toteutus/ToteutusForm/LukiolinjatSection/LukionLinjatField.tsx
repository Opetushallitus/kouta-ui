import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import FieldGroup from '#/src/components/FieldGroup';
import {
  FormFieldAsyncKoodistoSelect,
  FormFieldEditor,
  FormFieldSwitch,
} from '#/src/components/formFields';
import { SectionInnerCollapse } from '#/src/components/SectionInnerCollapse';
import Spacing from '#/src/components/Spacing';
import { Box } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import useKoodisto from '#/src/hooks/useKoodisto';

const LukiolinjaOsio = ({
  name,
  title,
  isKaytossaLabel,
  valinnatLabel,
  kuvausLabel,
  koodisto,
}) => {
  const selectedItems = useFieldValue(`${name}.valinnat`) ?? [];
  const isKaytossa = useFieldValue(`${name}.kaytossa`);
  const { data } = useKoodisto({ koodisto });

  return (
    <FieldGroup title={title}>
      <Box mb={2}>
        <Field component={FormFieldSwitch} name={`${name}.kaytossa`}>
          {isKaytossaLabel}
        </Field>
      </Box>
      {isKaytossa && (
        <>
          <Box mb={3}>
            <Field
              component={FormFieldAsyncKoodistoSelect}
              name={`${name}.valinnat`}
              label={valinnatLabel}
              koodistoData={data}
              showAllOptions
              required
              isMulti
            />
          </Box>
          {selectedItems?.map(({ value, label }) => (
            <Box mb={3}>
              <SectionInnerCollapse header={label} key={value}>
                <Field
                  component={FormFieldEditor}
                  label={kuvausLabel}
                  name={`${name}.kuvaukset.${value}`}
                />
              </SectionInnerCollapse>
            </Box>
          ))}
        </>
      )}
    </FieldGroup>
  );
};

const LukiolinjatField = ({ name }) => {
  const { t } = useTranslation();

  return (
    <>
      <LukiolinjaOsio
        name={`${name}.painotukset`}
        title={t('toteutuslomake.painotukset')}
        kuvausLabel={t('toteutuslomake.painotuksenKuvaus')}
        isKaytossaLabel={t('toteutuslomake.lukiollaOnPainotuksia')}
        valinnatLabel={t('toteutuslomake.valitsePainotukset')}
        // TODO: Vaihda koodisto kun tiedetään mikä se on
        koodisto="lukiolinjat"
      />
      <Spacing marginBottom={8} />
      <LukiolinjaOsio
        name={`${name}.erityisetKoulutustehtavat`}
        title={t('toteutuslomake.erityisetKoulutustehtavat')}
        kuvausLabel={t('toteutuslomake.erityisenKoulutustehtavanKuvaus')}
        isKaytossaLabel={t(
          'toteutuslomake.lukiollaOnErityisiaKoulutustehtavia'
        )}
        valinnatLabel={t('toteutuslomake.valitseErityisetKoulutustehtavat')}
        // TODO: Vaihda koodisto kun tiedetään mikä se on
        koodisto="lukiolinjat"
      />
    </>
  );
};

export default LukiolinjatField;
