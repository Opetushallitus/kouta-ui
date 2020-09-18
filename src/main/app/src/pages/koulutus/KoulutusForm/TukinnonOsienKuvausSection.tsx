import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useFieldValue } from '#/src/hooks/form';
import { getLanguageValue } from '#/src/utils/languageUtils';
import FormConfigFragment from '#/src/components/FormConfigFragment';
import { Box, Typography } from '#/src/components/virkailija';
import useApiAsync from '#/src/hooks/useApiAsync';
import { getTutkinnonOsanKuvaus } from '#/src/utils/koulutus/getTutkinnonOsanKuvaus';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { getThemeProp, spacing } from '#/src/theme';
import Anchor from '#/src/components/Anchor';
import { useUrls } from '#/src/contexts/contextHooks';

const TutkinnonOsaInfo = ({ className, eperuste, viite, osa, language }) => {
  const { t } = useTranslation();
  const apiUrls = useUrls();
  return (
    <div className={className}>
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
        {t('koulutuslomake.ammattitaitovaatimukset')}
      </Typography>

      <StyledSectionHTML html={osa?.ammattitaitovaatimukset?.[language]} />

      <Typography variant="h6" mb={2}>
        {t('koulutuslomake.ammattitaidonOsoittamistavat')}
      </Typography>
      <StyledSectionHTML html={osa?.ammattitaidonOsoittamistavat?.[language]} />
    </div>
  );
};

const StyledTutkinnonOsaInfo = styled(TutkinnonOsaInfo)`
  background-color: ${getThemeProp('colors.grayLighten6')};
  padding: ${spacing(4)};
  line-height: 23px;
`;

export const TutkinnonOsienKuvausSection = ({ disabled, language, name }) => {
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
            <StyledTutkinnonOsaInfo
              viite={viiteForOsa(osa)}
              eperuste={eperusteForOsa(osa)}
              key={`${osa.id}_${index}`}
              osa={osa}
              language={language}
            />
          ))}
        </Box>
      </FormConfigFragment>
    </Box>
  );
};
