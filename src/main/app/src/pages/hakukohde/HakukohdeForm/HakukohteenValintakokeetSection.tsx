import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field, FieldArray } from 'redux-form';
import styled from 'styled-components';

import DividerHeading from '#/src/components/DividerHeading';
import FieldGroup from '#/src/components/FieldGroup';
import { FormFieldEditor } from '#/src/components/formFields';
import { KokeetTaiLisanaytotFields } from '#/src/components/KokeetTaiLisanaytotFields';
import { SimpleCollapse } from '#/src/components/SimpleCollapse';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { TilaisuudetFields } from '#/src/components/TilaisuudetFields';
import { Box } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import { getThemeProp, spacing } from '#/src/theme';
import { getTestIdProps } from '#/src/utils';
import { useValintaperusteById } from '#/src/utils/valintaperuste/getValintaperusteById';

import { ReadonlyKoeJaTilaisuudet } from './ReadonlyKoeJaTilaisuudet';

const SubSectionBox = styled(Box)`
  background-color: ${getThemeProp('colors.grayLighten6')};
  padding: ${spacing(4)};
  margin-bottom: 16px;
`;

export const HakukohteenValintakokeetSection = ({ name, language }) => {
  const { t } = useTranslation();
  const valintaperusteOid = useFieldValue(
    'valintaperusteenKuvaus.valintaperuste'
  )?.value;
  const { data: valintaperuste } = useValintaperusteById(valintaperusteOid);
  const valintaperusteenKokeidenYleiskuvaus =
    valintaperuste?.metadata?.valintakokeidenYleiskuvaus;
  const valintaperusteenValintakokeet = valintaperuste?.valintakokeet || [];

  return (
    <>
      {valintaperusteenKokeidenYleiskuvaus?.[language] && (
        <>
          <DividerHeading>
            {t('koeTaiLisanaytto.valintaperusteenYleisKuvaus')}
          </DividerHeading>
          <StyledSectionHTML
            html={valintaperusteenKokeidenYleiskuvaus[language]}
          />
        </>
      )}
      <FieldGroup title={t('koeTaiLisanaytto.hakukohteenYleisKuvaus')}>
        <Box ml={12} mr={12} {...getTestIdProps('yleisKuvaus')}>
          <Field
            name={`${name}.yleisKuvaus.${language}`}
            component={FormFieldEditor}
          />
        </Box>
      </FieldGroup>
      {valintaperusteenValintakokeet.length > 0 && (
        <div {...getTestIdProps('valintaperusteenValintakokeet')}>
          <DividerHeading>
            {t('koeTaiLisanaytto.valintaperusteenValintakokeet')}
          </DividerHeading>
          {valintaperusteenValintakokeet.map(({ id, ...rest }, index) => (
            <SubSectionBox>
              <SimpleCollapse
                header={t('koeTaiLisanaytto.title', { index: index + 1 })}
                key={id}
              >
                <ReadonlyKoeJaTilaisuudet language={language} {...rest} />
                <FieldArray
                  name={`${name}.valintaperusteenValintakokeidenLisatilaisuudet.${id}`}
                  readonlyAmount={rest?.tilaisuudet?.length}
                  backgroundColor={getThemeProp('colors.white')}
                  component={TilaisuudetFields}
                  language={language}
                  t={t}
                />
              </SimpleCollapse>
            </SubSectionBox>
          ))}
        </div>
      )}
      <DividerHeading>
        {t('koeTaiLisanaytto.hakukohteenValintakokeet')}
      </DividerHeading>
      <FieldArray
        name={`${name}.kokeetTaiLisanaytot`}
        readonlyAmount={valintaperusteenValintakokeet?.length}
        component={KokeetTaiLisanaytotFields}
        language={language}
        t={t}
      />
    </>
  );
};
