import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import FieldGroup from '#/src/components/FieldGroup';
import { FormFieldInput, FormFieldUrlInput } from '#/src/components/formFields';
import { KoodistoCollapseList } from '#/src/components/KoodistoCollapseList';
import { Box, Typography } from '#/src/components/virkailija';
import { useLanguageTab } from '#/src/contexts/LanguageTabContext';
import { useKoodisto } from '#/src/hooks/useKoodisto';
import { formatKoodiLabelWithArvo } from '#/src/utils';
import { koodiUriWithoutVersion } from '#/src/utils/koodi/koodiUriWithoutVersion';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';

import {
  useDiplomiKoodiUriToIdMapping,
  useEPerusteLukiodiplomit,
  useEPerusteLukiodiplomiTiedot,
} from './diplomiEPerusteHelpers';

const DiplomiKuvausHeading = styled(Typography).attrs({ variant: 'h6' })`
  margin-bottom: 8px;
`;

const DiplomiKuvausUnorderedList = styled.ul`
  margin-top: 8px;
  margin-bottom: 16px;
`;

const EPerusteDiplomiKuvaus = ({ diplomiTiedot }) => {
  const { t } = useTranslation();
  const language = useLanguageTab();
  const sisallot = diplomiTiedot?.sisallot?.[0]?.sisallot;
  const tavoitteet = diplomiTiedot?.tavoitteet;

  return (
    <Box mb={2}>
      {tavoitteet && (
        <>
          <DiplomiKuvausHeading>
            {t('eperuste.yleisetTavoitteet')}
          </DiplomiKuvausHeading>
          <Typography variant="body">
            {getFirstLanguageValue(tavoitteet?.kohde, language)}
          </Typography>
          <Typography variant="body">
            <DiplomiKuvausUnorderedList>
              {tavoitteet?.tavoitteet?.map(tavoite => (
                <li key={tavoite._id}>
                  {getFirstLanguageValue(tavoite, language)}
                </li>
              ))}
            </DiplomiKuvausUnorderedList>
          </Typography>
        </>
      )}
      {sisallot && (
        <>
          <DiplomiKuvausHeading>
            {t('eperuste.keskeisetSisallot')}
          </DiplomiKuvausHeading>
          <Typography variant="body">
            <DiplomiKuvausUnorderedList>
              {sisallot.map(sisalto => (
                <li key={sisalto._id}>
                  {getFirstLanguageValue(sisalto, language)}
                </li>
              ))}
            </DiplomiKuvausUnorderedList>
          </Typography>
        </>
      )}
      <Typography variant="secondary" as="div" marginTop={1}>
        ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
      </Typography>
    </Box>
  );
};

type DiplomiCollapseContentProps = {
  koodiUri: string;
  name: string;
  index: number;
  itemProps?: { diplomiKoodiUriToId: Record<string, string> };
};

const DiplomiCollapseContent = ({
  koodiUri: koodiUriWithVersion,
  name,
  index,
  itemProps,
}: DiplomiCollapseContentProps) => {
  const { t } = useTranslation();

  const koodiUri = koodiUriWithoutVersion(koodiUriWithVersion);
  const language = useLanguageTab();

  const moduuliId = itemProps?.diplomiKoodiUriToId?.[koodiUri];

  const { data: lukiodiplomiTiedot } = useEPerusteLukiodiplomiTiedot(moduuliId);

  return (
    <>
      <EPerusteDiplomiKuvaus diplomiTiedot={lukiodiplomiTiedot} />
      <Box display="flex" justifyContent="stretch">
        <Box flexGrow={1} mr={2}>
          <Field
            name={`${name}.linkit[${index}].url.${language}`}
            label={t('toteutuslomake.linkki')}
            component={FormFieldUrlInput}
          />
        </Box>
        <Box flexGrow={1}>
          <Field
            name={`${name}.linkit[${index}].alt.${language}`}
            label={t('toteutuslomake.linkinAltTeksti')}
            component={FormFieldInput}
          />
        </Box>
      </Box>
    </>
  );
};

export const DiplomiFields = ({ name }: { name: string }) => {
  const { t } = useTranslation();

  const { data: lukiodiplomitData } = useEPerusteLukiodiplomit();

  const diplomiKoodiUriToId = useDiplomiKoodiUriToIdMapping(lukiodiplomitData);

  const { data: koodistoData } = useKoodisto({
    koodisto: 'moduulikoodistolops2021',
  });

  const filteredKoodistoData = useMemo(
    () =>
      koodistoData?.filter(({ koodiUri }) => diplomiKoodiUriToId?.[koodiUri]),
    [koodistoData, diplomiKoodiUriToId]
  );

  return (
    <FieldGroup title={t('toteutuslomake.lukiodiplomi')}>
      <KoodistoCollapseList
        koodistoData={filteredKoodistoData}
        selectLabel={t('toteutuslomake.valitseDiplomiOppiaineet')}
        CollapseContent={DiplomiCollapseContent}
        formatLabel={formatKoodiLabelWithArvo}
        name={name}
        itemProps={{ diplomiKoodiUriToId }}
      />
    </FieldGroup>
  );
};
