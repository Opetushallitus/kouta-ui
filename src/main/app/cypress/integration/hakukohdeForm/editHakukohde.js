import merge from 'lodash/merge';

import { getByTestId, stubKoodistoRoute } from '../../utils';

import organisaatio from '../../data/organisaatio';
import koulutus from '../../data/koulutus';
import haku from '../../data/haku';
import toteutus from '../../data/toteutus';
import valintaperuste from '../../data/valintaperuste';
import hakukohde from '../../data/hakukohde';
import { stubHakukohdeFormRoutes } from '../../hakukohdeFormUtils';

const tallenna = cy => {
  getByTestId('tallennaHakukohdeButton', cy).click({ force: true });
};

describe('createHakukohdeForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const toteutusOid = '2.1.1.1.1.1';
  const koulutusOid = '3.1.1.1.1';
  const hakuOid = '4.1.1.1.1.1';
  const valintaperusteOid = '5.1.1.1.1.1';
  const hakukohdeOid = '6.1.1.1.1.1';

  const testHakukohdeFields = {
    toteutusOid,
    hakuOid,
    organisaatioOid,
    oid: hakukohdeOid,
  };

  beforeEach(() => {
    cy.server();

    stubHakukohdeFormRoutes({ cy, organisaatioOid, hakuOid });

    cy.route({
      method: 'GET',
      url: `**/toteutus/${toteutusOid}`,
      response: merge(toteutus({ tyyppi: 'amm' }), {
        oid: toteutusOid,
        organisaatioOid: organisaatioOid,
        koulutusOid: koulutusOid,
      }),
    });

    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'amm' }), {
        oid: koulutusOid,
        organisaatioOid: organisaatioOid,
      }),
    });

    cy.route({
      method: 'GET',
      url: '**/valintaperuste/list**',
      response: [
        merge(valintaperuste(), {
          oid: valintaperusteOid,
          nimi: { fi: 'Valintaperusteen nimi' },
        }),
      ],
    });

    cy.visit(`/hakukohde/${hakukohdeOid}/muokkaus`);
  });

  it('should be able to edit hakukohde', () => {
    cy.route({
      method: 'GET',
      url: `**/hakukohde/${hakukohdeOid}`,
      response: merge(hakukohde(), testHakukohdeFields),
    });

    cy.route({
      method: 'POST',
      url: '**/hakukohde',
      response: {
        muokattu: false,
      },
    }).as('updateHakukohdeRequest');

    tallenna(cy);

    cy.wait('@updateHakukohdeRequest').then(({ request }) => {
      expect(request.body).to.deep.equal({
        oid: '6.1.1.1.1.1',
        toteutusOid: '2.1.1.1.1.1',
        hakuOid: '4.1.1.1.1.1',
        tila: 'tallennettu',
        nimi: { fi: 'Hakukohteen nimi' },
        alkamiskausiKoodiUri: 'kausi_0#1',
        alkamisvuosi: 2024,
        hakulomake: {},
        aloituspaikat: 100,
        pohjakoulutusvaatimusKoodiUrit: ['pohjakoulutusvaatimustoinenaste_0#1'],
        muuPohjakoulutusvaatimus: {},
        toinenAsteOnkoKaksoistutkinto: true,
        kaytetaanHaunAikataulua: false,
        liitteetOnkoSamaToimitusaika: false,
        liitteetOnkoSamaToimitusosoite: false,
        liitteidenToimitusosoite: {
          osoite: {
            osoite: { fi: 'Paasikivenkatu 7' },
            postinumero: '15110',
            postitoimipaikka: { fi: 'Lahti' },
          },
          sahkoposti: 'salpaus@salpaus.fi',
        },
        liitteet: [
          {
            tyyppi: null,
            nimi: { fi: 'Nimi' },
            toimitusaika: '2011-11-11T10:30',
            toimitusosoite: {
              osoite: {
                osoite: { fi: 'Osoite' },
                postinumero: '00940',
                postitoimipaikka: { fi: 'Postitoimipaikka' },
              },
              sahkoposti: 'sahkoposti@email.com',
            },
            kuvaus: { fi: 'Kuvaus' },
          },
        ],
        valintakokeet: [
          {
            tyyppi: 'valintakokeentyyppi_0#1',
            tilaisuudet: [
              {
                osoite: {
                  osoite: { fi: 'Osoite' },
                  postinumero: '00940',
                  postitoimipaikka: { fi: 'Postitoimipaikka' },
                },
                aika: {
                  alkaa: '2011-11-11T10:30',
                  paattyy: '2011-11-12T11:45',
                },
                lisatietoja: { fi: 'Lisätietoja' },
              },
            ],
          },
        ],
        hakuajat: [{ alkaa: '2011-11-11T10:30', paattyy: '2011-11-12T11:45' }],
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi', 'sv'],
        modified: '2019-04-04T08:28',
        liitteidenToimitusaika: null,
        valintaperuste: null,
        ensikertalaisenAloituspaikat: null,
      });
    });
  });
});
