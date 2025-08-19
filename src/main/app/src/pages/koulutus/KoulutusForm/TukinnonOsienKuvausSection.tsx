import React from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Anchor from '#/src/components/Anchor';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { Box, Spin, Typography } from '#/src/components/virkailija';
import { useUrls } from '#/src/contexts/UrlContext';
import { getThemeProp } from '#/src/theme';
import { sanitizeHTML } from '#/src/utils';
import { useTutkinnonOsienKuvaukset } from '#/src/utils/koulutus/getTutkinnonOsanKuvaus';
import { useEPerusteTutkinnonOsat } from '#/src/utils/koulutus/getTutkinnonosaViite';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { useSelectedTutkinnonOsat } from '../useSelectedTutkinnonOsat';
import { StyledInfoBox } from './AmmatillinenTiedotSection/InfoBox';

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
        {_fp.map(({ kuvaus, vaatimukset }) => {
          return (
            <div key={kuvaus?._id}>
              <BodyHeading>{sanitizeHTML(kuvaus[language])}</BodyHeading>
              <Typography variant="body">
                <ul>
                  {_fp.map(({ vaatimus, koodi }) => (
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

const TutkinnonOsaKuvaus = ({ ePerusteId, viiteId, osa, language }) => {
  const { i18n } = useTranslation();
  const t = i18n.getFixedT(language);

  const { data: tutkinnonOsat, isLoading } = useEPerusteTutkinnonOsat({
    ePerusteId,
  });

  const viiteData = _fp.find(tutkinnonOsa => tutkinnonOsa?.id === viiteId)(
    tutkinnonOsat
  );

  const apiUrls = useUrls();
  return isLoading ? (
    <Spin />
  ) : (
    <>
      <Typography variant="h4" mb={2}>
        {getLanguageValue(osa?.nimi, language)}, {viiteData?.laajuus} osp (
        <Anchor
          href={apiUrls?.url(
            'eperusteet.tutkinnonosat',
            language,
            ePerusteId,
            viiteData?.id
          )}
          target="_blank"
        >
          {osa.koodiArvo}
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

export const TutkinnonOsienKuvausSection = ({ language }) => {
  const { t } = useTranslation();

  const selectedTutkinnonOsat = useSelectedTutkinnonOsat();

  const selectedTutkinnonOsaIds = selectedTutkinnonOsat?.map(
    t => t?.tutkinnonosaId
  );

  const { data: kuvaukset } = useTutkinnonOsienKuvaukset({
    tutkinnonOsat: selectedTutkinnonOsaIds,
  });

  const viiteIdForOsa = ({ id }) => {
    return selectedTutkinnonOsat.find(
      v => v.tutkinnonosaId === _fp.toNumber(id)
    )?.tutkinnonosaViite;
  };

  const eperusteForOsa = ({ id }) => {
    return selectedTutkinnonOsat.find(
      v => v.tutkinnonosaId === _fp.toNumber(id)
    )?.ePerusteId;
  };

  return (
    <Box mb={-2}>
      <Box mb={2}>
        {(kuvaukset || []).map((osa, index) => (
          <StyledInfoBox key={`${osa.id}_${index}`} mb={2}>
            <TutkinnonOsaKuvaus
              viiteId={viiteIdForOsa(osa)}
              ePerusteId={eperusteForOsa(osa)}
              osa={osa}
              language={language}
            />
          </StyledInfoBox>
        ))}
        <Typography variant="secondary" as="div" marginTop={1}>
          ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
        </Typography>
      </Box>
    </Box>
  );
};
