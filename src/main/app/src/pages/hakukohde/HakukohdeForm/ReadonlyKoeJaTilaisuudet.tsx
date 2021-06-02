import React from 'react';

import { useTranslation } from 'react-i18next';
import { Grid, Cell } from 'styled-css-grid';

import Heading from '#/src/components/Heading';
import StyledSectionHTML from '#/src/components/StyledSectionHTML';
import { Divider } from '#/src/components/virkailija';
import { useKoodiNimi } from '#/src/hooks/useKoodiNimi';
import { formatDateValue } from '#/src/utils';

import { useReadonlyKokeetJaTilaisuudet } from './useReadonlyKokeetJaTilaisuudet';

type Props = {
  index: number;
  language: LanguageCode;
  id: string;
  tyyppiKoodiUri: string;
  nimi: TranslatedField<string>;
  metadata: {
    tietoja: TranslatedField<string>;
    ohjeetEnnakkovalmistautumiseen: TranslatedField<string>;
    ohjeetErityisjarjestelyihin: TranslatedField<string>;
  };
  tilaisuudet: Array<{
    osoite: {
      osoite: TranslatedField<string>;
      postinumeroKoodiUri: string;
    };
    aika: {
      alkaa: string;
      paattyy: string;
    };
    jarjestamispaikka: TranslatedField<string>;
    lisatietoja: TranslatedField<string>;
  }>;
};

export const ReadonlyKoeJaTilaisuudet = ({
  language,
  metadata: {
    ohjeetEnnakkovalmistautumiseen,
    ohjeetErityisjarjestelyihin,
    tietoja,
  },
  nimi,
  tilaisuudet,
  tyyppiKoodiUri,
}: Props) => {
  const { t } = useTranslation();
  const { nimi: tyyppiKoodiNimi } = useKoodiNimi(tyyppiKoodiUri, { language });
  const { tilaisuudet: usedTilaisuudet } = useReadonlyKokeetJaTilaisuudet(
    tilaisuudet,
    language
  );

  return (
    <>
      <Grid css={{ marginBottom: '12px' }}>
        <Cell width={4}>
          <Heading>{t('koeTaiLisanaytto.tyyppi')}</Heading>
          {tyyppiKoodiNimi}
        </Cell>
        <Cell width={4}>
          <Heading>{t('koeTaiLisanaytto.hakijalleNakyvaNimi')}</Heading>
          {nimi[language]}
        </Cell>
      </Grid>
      {tietoja[language] && (
        <>
          <Heading>{t('koeTaiLisanaytto.tietoaHakijalle')}</Heading>
          <StyledSectionHTML html={tietoja[language]} />
        </>
      )}
      {ohjeetEnnakkovalmistautumiseen[language] && (
        <>
          <Heading>
            {t('koeTaiLisanaytto.materiaaliJaValmistautumisohjeet')}
          </Heading>
          <StyledSectionHTML html={ohjeetEnnakkovalmistautumiseen[language]} />
        </>
      )}
      {ohjeetErityisjarjestelyihin[language] && (
        <>
          <Heading>{t('koeTaiLisanaytto.ohjeetErityisjarjestelyihin')}</Heading>
          <StyledSectionHTML html={ohjeetErityisjarjestelyihin[language]} />
        </>
      )}
      {usedTilaisuudet?.length > 0 && (
        <>
          <Divider />
          {usedTilaisuudet.map(
            (
              { aika, jarjestamispaikka, lisatietoja, osoite },
              tilaisuusIndex
            ) => (
              <React.Fragment key={`readonly-tilaisuus-${tilaisuusIndex}`}>
                <Heading>
                  {t('koeTaiLisanaytto.tilaisuusTitle', {
                    index: tilaisuusIndex + 1,
                  })}
                </Heading>
                <Grid>
                  <Cell width={5}>
                    {aika?.alkaa && (
                      <Grid>
                        <Cell width={5}>
                          <Heading>{t('yleiset.alkaa')}</Heading>
                        </Cell>
                        <Cell width={7}>{formatDateValue(aika.alkaa)}</Cell>
                      </Grid>
                    )}
                    {aika?.paattyy && (
                      <Grid>
                        <Cell width={5}>
                          <Heading>{t('yleiset.paattyy')}</Heading>
                        </Cell>
                        <Cell width={7}>{formatDateValue(aika.paattyy)}</Cell>
                      </Grid>
                    )}
                    {jarjestamispaikka?.[language] && (
                      <Grid>
                        <Cell width={5}>
                          <Heading>
                            {t('koeTaiLisanaytto.jarjestamispaikka')}
                          </Heading>
                        </Cell>
                        <Cell width={7}>{jarjestamispaikka[language]}</Cell>
                      </Grid>
                    )}
                    {osoite?.osoite?.[language] && (
                      <Grid>
                        <Cell width={5}>
                          <Heading>{t('yleiset.osoite')}</Heading>
                        </Cell>
                        <Cell width={7}>{osoite.osoite[language]}</Cell>
                      </Grid>
                    )}
                    {osoite?.postinumero && (
                      <Grid>
                        <Cell width={5}>
                          <Heading>{t('yleiset.postinumero')}</Heading>
                        </Cell>
                        <Cell width={7}>{osoite.postinumero}</Cell>
                      </Grid>
                    )}
                  </Cell>
                  <Cell width={7}>
                    <Grid>
                      <Cell width={2}>
                        <Heading>{t('yleiset.lisatietoa')}</Heading>
                      </Cell>
                      <Cell width={8}>
                        <StyledSectionHTML
                          noChildMargin
                          html={lisatietoja[language]}
                        />
                      </Cell>
                    </Grid>
                  </Cell>
                </Grid>
              </React.Fragment>
            )
          )}
          <Divider />
        </>
      )}
    </>
  );
};
