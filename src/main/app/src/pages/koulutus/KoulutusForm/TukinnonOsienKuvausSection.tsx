import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import _ from 'lodash/fp';
import { useFieldValue } from '#/src/hooks/form';
import { getLanguageValue } from '#/src/utils/languageUtils';
import FormConfigFragment from '#/src/components/FormConfigFragment';
import { Box, Typography } from '#/src/components/virkailija';
import useApiAsync from '#/src/hooks/useApiAsync';
import { getTutkinnonOsanKuvaus } from '#/src/utils/koulutus/getTutkinnonOsanKuvaus';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { getThemeProp } from '#/src/theme';
import Anchor from '#/src/components/Anchor';
import { useUrls } from '#/src/contexts/contextHooks';
import { sanitizeHTML } from '#/src/utils';
import { StyledInfoBox } from './KoulutuksenEPerusteTiedot/InfoBox';

const BodyHeading = styled(Typography).attrs({ variant: 'h6' })`
  color: ${getThemeProp('colors.text.primary')};
`;

const AmmattitaitoVaatimukset = ({ tutkinnonOsa, language }) => {
  const { ammattitaitovaatimukset, ammattitaitovaatimukset2019 } = tutkinnonOsa;

  if (ammattitaitovaatimukset) {
    return <StyledSectionHTML html={ammattitaitovaatimukset[language]} />;
  } else if (ammattitaitovaatimukset2019) {
    return (
      <>
        {_.map(({ kuvaus, vaatimukset }) => {
          return (
            <div key={kuvaus?._id}>
              <BodyHeading>{sanitizeHTML(kuvaus[language])}</BodyHeading>
              <Typography variant="body">
                <ul>
                  {_.map(({ vaatimus, koodi }) => (
                    <li key={koodi?.uri}>{vaatimus[language]}</li>
                  ))(vaatimukset)}
                </ul>
              </Typography>
            </div>
          );
        })(ammattitaitovaatimukset2019?.kohdealueet)}
      </>
    );
  }
  return <Typography variant="body">-</Typography>;
};

const TutkinnonOsaInfo = ({ eperuste, viite, osa, language }) => {
  const { i18n } = useTranslation();
  const t = i18n.getFixedT(language);

  const apiUrls = useUrls();
  return (
    <>
      <Typography variant="h4" mb={2}>
        {getLanguageValue(osa?.nimi, language)}, {viite?.laajuus} osp (
        <Anchor
          href={apiUrls?.url(
            'eperusteet.tutkinnonosat',
            language,
            eperuste,
            viite?.id
          )}
          target="_blank"
        >
          {viite?.id}
        </Anchor>
        )
      </Typography>

      <Typography variant="h6" mb={2}>
        {t('eperuste.ammattitaitovaatimukset')}
      </Typography>

      <AmmattitaitoVaatimukset tutkinnonOsa={osa} language={language} />

      <Typography variant="h6" mb={2}>
        {t('eperuste.ammattitaidonOsoittamistavat')}
      </Typography>
      <StyledSectionHTML html={osa?.ammattitaidonOsoittamistavat?.[language]} />
    </>
  );
};

export const TutkinnonOsienKuvausSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();
  const tutkinnonosat = useFieldValue(`${name}.osat`);

  const selectedTutkinnonOsat = useMemo(() => {
    return tutkinnonosat
      ?.flatMap(t => t.selectedTutkinnonosat?._tutkinnonOsa ?? [])
      .sort();
  }, [tutkinnonosat]);

  const { data: kuvaukset } = useApiAsync({
    promiseFn: getTutkinnonOsanKuvaus,
    tutkinnonOsat: selectedTutkinnonOsat,
    watch: selectedTutkinnonOsat,
  });

  const viiteForOsa = ({ id }) => {
    const viitteet = tutkinnonosat.flatMap(t => t.selectedTutkinnonosat || []);
    return viitteet.find(v => v._tutkinnonOsa === id.toString());
  };

  const eperusteForOsa = ({ id }) => {
    return tutkinnonosat.find(
      v => v.selectedTutkinnonosat?._tutkinnonOsa === id.toString()
    )?.eperuste?.value;
  };
  return (
    <Box mb={-2}>
      <FormConfigFragment name="osat">
        <Box mb={2}>
          {(kuvaukset || []).map((osa, index) => (
            <StyledInfoBox key={`${osa.id}_${index}`} mb={2}>
              <TutkinnonOsaInfo
                viite={viiteForOsa(osa)}
                eperuste={eperusteForOsa(osa)}
                osa={osa}
                language={language}
              />
            </StyledInfoBox>
          ))}
          <Typography variant="secondary" as="div" marginTop={1}>
            ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
          </Typography>
        </Box>
      </FormConfigFragment>
    </Box>
  );
};
