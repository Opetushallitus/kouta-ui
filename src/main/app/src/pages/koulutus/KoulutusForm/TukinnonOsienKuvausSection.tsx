import { isEmpty, toNumber } from 'lodash';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Anchor from '#/src/components/Anchor';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { Box, Spin, Typography } from '#/src/components/virkailija';
import { useUrls } from '#/src/contexts/UrlContext';
import { useKoulutusFormField } from '#/src/hooks/form';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { useUserLanguage } from '#/src/hooks/useUserLanguage';
import { getThemeProp } from '#/src/theme';
import {
  AmosaaPaikallisetTutkinnonosatResponse,
  AmosaaOmaTutkinnonosa,
} from '#/src/types/domainTypes';
import { sanitizeHTML } from '#/src/utils';
import { getPaikallisetTutkinnonosat } from '#/src/utils/ePeruste/getPaikallisetTutkinnonosat';
import { useTutkinnonOsienKuvaukset } from '#/src/utils/koulutus/getTutkinnonOsanKuvaus';
import { useEPerusteTutkinnonOsat } from '#/src/utils/koulutus/getTutkinnonosaViite';
import { getLanguageValue } from '#/src/utils/languageUtils';

import { useSelectedTutkinnonOsat } from '../useSelectedTutkinnonOsat';
import { StyledInfoBox } from './AmmatillinenTiedotSection/InfoBox';

const BodyHeading = styled(Typography).attrs({ variant: 'h6' })`
  color: ${getThemeProp('colors.text.primary')};
`;

// ePeruste API responses are not schema-generated, so we type them locally.
type EPerusteVaatimus = {
  vaatimus?: TranslatedField;
  koodi?: { uri?: string };
};

type EPerusteKohdealue = {
  kuvaus?: { _id?: string } & TranslatedField;
  vaatimukset?: Array<EPerusteVaatimus>;
};

type EPerusteTutkinnonOsa = {
  id: number;
  koodiArvo: string;
  nimi?: TranslatedField;
  ammattitaitovaatimukset?: TranslatedField;
  ammattitaitovaatimukset2019?: {
    kohdealueet?: Array<EPerusteKohdealue>;
  };
  ammattitaidonOsoittamistavat?: TranslatedField;
};

type EPerusteTutkinnonOsaViite = {
  id?: number;
  laajuus?: number;
};

type AmmattitaitoVaatimuksetProps = {
  tutkinnonOsa: EPerusteTutkinnonOsa;
  language: LanguageCode;
};

const AmmattitaitoVaatimukset = ({
  tutkinnonOsa,
  language,
}: AmmattitaitoVaatimuksetProps) => {
  const { ammattitaitovaatimukset, ammattitaitovaatimukset2019 } = tutkinnonOsa;

  if (ammattitaitovaatimukset) {
    return <StyledSectionHTML html={ammattitaitovaatimukset?.[language]} />;
  } else if (ammattitaitovaatimukset2019) {
    return (
      <>
        {ammattitaitovaatimukset2019?.kohdealueet?.map(
          ({ kuvaus, vaatimukset }) => {
            return (
              <div key={kuvaus?._id}>
                <BodyHeading>{sanitizeHTML(kuvaus?.[language])}</BodyHeading>
                <Typography variant="body">
                  <ul>
                    {vaatimukset?.map(({ vaatimus, koodi }) => (
                      <li key={koodi?.uri}>{vaatimus?.[language]}</li>
                    ))}
                  </ul>
                </Typography>
              </div>
            );
          }
        )}
      </>
    );
  }
  return <Typography variant="body">-</Typography>;
};

type TutkinnonOsaKuvausProps = {
  ePerusteId?: string;
  viiteId?: string;
  osa: EPerusteTutkinnonOsa;
  language: LanguageCode;
};

const TutkinnonOsaKuvaus = ({
  ePerusteId,
  viiteId,
  osa,
  language,
}: TutkinnonOsaKuvausProps) => {
  const { i18n } = useTranslation();
  const t = i18n.getFixedT(language);

  const { data: tutkinnonOsat, isLoading } = useEPerusteTutkinnonOsat({
    ePerusteId,
  });

  const viiteData: EPerusteTutkinnonOsaViite | undefined = tutkinnonOsat?.find(
    (tutkinnonOsa: EPerusteTutkinnonOsaViite) => tutkinnonOsa?.id === viiteId
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
            ePerusteId?.toString(),
            viiteData?.id?.toString()
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

const useSelectedPaikallisetTutkinnonOsat = () => {
  const language = useUserLanguage();
  const toteutussuunnitelmaId = useKoulutusFormField(
    'paikallisetTutkinnonOsat.toteutussuunnitelmaId'
  );
  const selectedOsat = useKoulutusFormField(
    'paikallisetTutkinnonOsat.tutkinnonosat'
  );

  const opsId: string | undefined = toteutussuunnitelmaId?.value;

  const { data: allOsat, isLoading } = useApiQuery(
    'getPaikallisetTutkinnonosat',
    getPaikallisetTutkinnonosat,
    { opsId },
    { enabled: Boolean(opsId) }
  );

  const selectedIds = new Set<string>(
    (selectedOsat ?? []).map(({ value }: { value: string }) => String(value))
  );

  const filtered: AmosaaPaikallisetTutkinnonosatResponse = (
    allOsat ?? []
  ).filter((osa: AmosaaPaikallisetTutkinnonosatResponse[number]) =>
    selectedIds.has(String(osa.id))
  );

  return { osat: filtered, isLoading, language, opsId };
};

type AmosaaAmmattitaitoVaatimuksetProps = {
  omatutkinnonosa?: AmosaaOmaTutkinnonosa;
  language: LanguageCode;
};

const AmosaaAmmattitaitoVaatimukset = ({
  omatutkinnonosa,
  language,
}: AmosaaAmmattitaitoVaatimuksetProps) => {
  const { i18n } = useTranslation();
  const t = i18n.getFixedT(language);

  const { ammattitaitovaatimukset, ammattitaitovaatimuksetlista } =
    omatutkinnonosa ?? {};

  const vaatimukset = ammattitaitovaatimukset ?? ammattitaitovaatimuksetlista;

  const hasVaatimukset =
    !isEmpty(vaatimukset?.kohdealueet) || !isEmpty(vaatimukset?.vaatimukset);

  return (
    hasVaatimukset && (
      <>
        <Typography variant="h6" mb={2}>
          {t('eperuste.ammattitaitovaatimukset')}
        </Typography>
        {vaatimukset?.kohdealueet?.map(({ kuvaus, vaatimukset: v }, i) => (
          <div key={i}>
            {kuvaus && (
              <BodyHeading>{getLanguageValue(kuvaus, language)}</BodyHeading>
            )}
            {v && (
              <Typography variant="body">
                <ul>
                  {v.map((vaatimus, j) => (
                    <li key={j}>
                      {getLanguageValue(vaatimus.vaatimus, language)}
                    </li>
                  ))}
                </ul>
              </Typography>
            )}
          </div>
        ))}
        {vaatimukset?.vaatimukset?.map(vaatimus => (
          <Typography key={vaatimus.koodi} variant="body">
            {getLanguageValue(vaatimus.vaatimus, language)}
          </Typography>
        ))}
      </>
    )
  );
};

type AmosaaAmmattitaidonOsoittamistavatProps = {
  omatutkinnonosa?: AmosaaOmaTutkinnonosa;
  language: LanguageCode;
};

const AmosaaAmmattitaidonOsoittamistavat = ({
  omatutkinnonosa,
  language,
}: AmosaaAmmattitaidonOsoittamistavatProps) => {
  const { i18n } = useTranslation();
  const t = i18n.getFixedT(language);

  const hasOsoittamistavat = !isEmpty(
    omatutkinnonosa?.ammattitaidonosoittamistavat
  );

  return (
    hasOsoittamistavat && (
      <>
        <Typography variant="h6" mb={2}>
          {t('eperuste.ammattitaidonOsoittamistavat')}
        </Typography>
        <StyledSectionHTML
          html={getLanguageValue(
            omatutkinnonosa?.ammattitaidonosoittamistavat,
            language
          )}
        />
      </>
    )
  );
};

type PaikallinenTutkinnonOsaKuvausProps = {
  osa: AmosaaPaikallisetTutkinnonosatResponse[number];
  opsId: string | undefined;
  language: LanguageCode;
};

const PaikallinenTutkinnonOsaKuvaus = ({
  osa,
  opsId,
  language,
}: PaikallinenTutkinnonOsaKuvausProps) => {
  const { omatutkinnonosa } = osa.tosa ?? {};
  const apiUrls = useUrls();
  return (
    <>
      <Typography variant="h4" mb={2}>
        {getLanguageValue(osa.nimi, language)}
        {omatutkinnonosa?.laajuus != null &&
          `, ${omatutkinnonosa.laajuus} osp`}{' '}
        (
        <Anchor
          href={apiUrls?.url(
            'eperusteet.paikallinen-tutkinnonosa',
            language,
            opsId,
            osa?.id?.toString()
          )}
          target="_blank"
        >
          {omatutkinnonosa?.koodi}
        </Anchor>
        )
      </Typography>

      <AmosaaAmmattitaitoVaatimukset
        omatutkinnonosa={omatutkinnonosa}
        language={language}
      />

      <AmosaaAmmattitaidonOsoittamistavat
        omatutkinnonosa={omatutkinnonosa}
        language={language}
      />
    </>
  );
};

type TutkinnonOsienKuvausSectionProps = {
  language: LanguageCode;
};

export const TutkinnonOsienKuvausSection = ({
  language,
}: TutkinnonOsienKuvausSectionProps) => {
  const { t } = useTranslation();

  const selectedTutkinnonOsat = useSelectedTutkinnonOsat();

  const selectedTutkinnonOsaIds = selectedTutkinnonOsat?.map(
    (t: { tutkinnonosaId: number }) => t?.tutkinnonosaId
  );

  const { data: kuvaukset } = useTutkinnonOsienKuvaukset({
    tutkinnonOsat: selectedTutkinnonOsaIds,
  });

  const viiteIdForOsa = ({ id }: { id: number }): string | undefined =>
    selectedTutkinnonOsat
      .find(
        (v: { tutkinnonosaId: number }) => v.tutkinnonosaId === toNumber(id)
      )
      ?.tutkinnonosaViite?.toString();

  const eperusteForOsa = ({ id }: { id: number }): string | undefined =>
    selectedTutkinnonOsat
      .find(
        (v: { tutkinnonosaId: number }) => v.tutkinnonosaId === toNumber(id)
      )
      ?.ePerusteId?.toString();

  const {
    osat: paikallisetOsat,
    isLoading: isLoadingPaikalliset,
    opsId,
  } = useSelectedPaikallisetTutkinnonOsat();

  return (
    <Box mb={-2}>
      <Box mb={2}>
        {(kuvaukset || []).map((osa: EPerusteTutkinnonOsa, index: number) => (
          <StyledInfoBox key={`${osa.id}_${index}`} mb={2}>
            <TutkinnonOsaKuvaus
              viiteId={viiteIdForOsa(osa)}
              ePerusteId={eperusteForOsa(osa)}
              osa={osa}
              language={language}
            />
          </StyledInfoBox>
        ))}
        {isLoadingPaikalliset ? (
          <Spin />
        ) : (
          (paikallisetOsat ?? []).map(
            (
              osa: AmosaaPaikallisetTutkinnonosatResponse[number],
              index: number
            ) => (
              <StyledInfoBox key={`paikallinen_${osa.id}_${index}`} mb={2}>
                <PaikallinenTutkinnonOsaKuvaus
                  osa={osa}
                  opsId={opsId}
                  language={language}
                />
              </StyledInfoBox>
            )
          )
        )}
        <Typography variant="secondary" as="div" marginTop={1}>
          ({t('yleiset.lahde')}: {t('yleiset.ePerusteet')})
        </Typography>
      </Box>
    </Box>
  );
};
