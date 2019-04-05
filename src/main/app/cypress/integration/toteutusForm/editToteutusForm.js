import merge from 'lodash/merge';

import { getByTestId } from '../../utils';
import koulutus from '../../data/koulutus';
import toteutus from '../../data/toteutus';
import { stubToteutusFormRoutes } from '../../toteutusFormUtils';

const tallenna = cy => {
  getByTestId('tallennaToteutusButton', cy).click();
};

describe('editToteutusForm', () => {
  const organisaatioOid = '1.1.1.1.1.1';
  const koulutusOid = '1.2.1.1.1.1';
  const toteutusOid = '1.3.1.1.1.1';
  const perusteId = '1';

  const testKoulutusFields = {
    oid: koulutusOid,
    organisaatioOid: organisaatioOid,
    koulutusKoodiUri: 'koulutus_0#1',
    tarjoajat: ['4.1.1.1.1.1', '2.1.1.1.1.1'],
  };

  const testToteutusFields = {
    oid: toteutusOid,
    tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
    organisaatioOid: organisaatioOid,
    koulutusOid: koulutusOid,
  };

  beforeEach(() => {
    cy.server();

    stubToteutusFormRoutes({ cy, organisaatioOid, perusteId });

    cy.route({
      method: 'GET',
      url: `**/toteutus/${toteutusOid}/hakukohteet/list**`,
      response: [],
    });

    cy.route({
      method: 'GET',
      url: `**/haku/list**`,
      response: [],
    });

    cy.visit(`/toteutus/${toteutusOid}/muokkaus`);
  });

  it('should be able to edit ammatillinen toteutus', () => {
    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'amm' }), testKoulutusFields),
    });

    cy.route({
      method: 'GET',
      url: `**/toteutus/${toteutusOid}`,
      response: merge(toteutus({ tyyppi: 'amm' }), testToteutusFields),
    });

    cy.route({
      method: 'POST',
      url: '**/toteutus',
      response: {
        muokattu: false,
      },
    }).as('updateAmmToteutusResponse');

    tallenna(cy);

    cy.wait('@updateAmmToteutusResponse').then(({ request }) => {
      expect(request.body).to.deep.equal({
        oid: '1.3.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
        tila: 'tallennettu',
        tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
        nimi: { fi: 'Koulutuskeskus Salpaus, jatkuva haku, eläintenhoitaja' },
        metadata: {
          opetus: {
            lisatiedot: [
              {
                otsikkoKoodiUri: 'koulutuksenjarjestamisenlisaosiot_0#1',
                teksti: { fi: 'koulutuksenjarjestamisenlisaosiot_0 kuvaus' },
              },
            ],
            opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_1#1'],
            onkoMaksullinen: true,
            maksunMaara: { fi: '20' },
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUri: 'opetusaikakk_1#1',
            opetuskieletKuvaus: { fi: 'Opetuskieli kuvaus' },
            opetustapaKuvaus: { fi: 'Opetustapa kuvaus' },
            opetusaikaKuvaus: { fi: 'Opetusaika kuvaus' },
            maksullisuusKuvaus: { fi: 'Maksullisuus kuvaus' },
            alkamisaikaKuvaus: { fi: 'Alkamisaika kuvaus' },
            alkamiskausiKoodiUri: 'kausi_1#1',
            alkamisvuosi: '2024',
            onkoLukuvuosimaksua: false,
            lukuvuosimaksu: {},
            lukuvuosimaksuKuvaus: {},
            onkoStipendia: false,
            stipendinKuvaus: {},
            stipendinMaara: {},
          },
          osaamisalat: [
            {
              koodi: 'osaamisala_0',
              linkki: {
                fi: 'https://www.salpaus.fi/koulutusesittely/elaintenhoitaja/',
              },
              otsikko: { fi: 'Otsikko' },
            },
          ],
          yhteystieto: {
            nimi: { fi: 'Sami Raunio' },
            titteli: { fi: 'hakuhemmo' },
            sahkoposti: { fi: 'hakutoimisto@salpaus.fi' },
            puhelinnumero: { fi: '123456' },
            wwwSivu: { fi: 'www.salpaus.fi' },
          },
          ammattinimikkeet: [{ kieli: 'fi', arvo: 'eläintenhoitaja' }],
          asiasanat: [
            { kieli: 'fi', arvo: 'koira' },
            { kieli: 'fi', arvo: 'eläintenhoito' },
          ],
          ylemmanKorkeakoulututkinnonOsaamisalat: [],
          alemmanKorkeakoulututkinnonOsaamisalat: [],
          kuvaus: { fi: 'Toteutuksen kuvaus' },
          tyyppi: 'amm',
        },
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi', 'sv'],
        modified: '2019-03-26T10:19',
      });
    });
  });

  it('should be able to edit korkeakoulu toteutus', () => {
    cy.route({
      method: 'GET',
      url: `**/koulutus/${koulutusOid}`,
      response: merge(koulutus({ tyyppi: 'yo' }), testKoulutusFields),
    });

    cy.route({
      method: 'GET',
      url: `**/toteutus/${toteutusOid}`,
      response: merge(toteutus({ tyyppi: 'yo' }), testToteutusFields),
    });

    cy.route({
      method: 'POST',
      url: '**/toteutus',
      response: {
        muokattu: false,
      },
    }).as('updateYoToteutusResponse');

    tallenna(cy);

    cy.wait('@updateYoToteutusResponse').then(({ request }) => {
      expect(request.body).to.deep.equal({
        oid: '1.3.1.1.1.1',
        koulutusOid: '1.2.1.1.1.1',
        tila: 'tallennettu',
        tarjoajat: ['5.1.1.1.1.1', '3.1.1.1.1.1'],
        nimi: { fi: 'Koulutuskeskus Salpaus, jatkuva haku, eläintenhoitaja' },
        metadata: {
          opetus: {
            lisatiedot: [
              {
                otsikkoKoodiUri: 'koulutuksenjarjestamisenlisaosiot_0#1',
                teksti: { fi: 'koulutuksenjarjestamisenlisaosiot_0 kuvaus' },
              },
            ],
            opetuskieliKoodiUrit: ['oppilaitoksenopetuskieli_1#1'],
            onkoMaksullinen: true,
            maksunMaara: { fi: '20' },
            opetustapaKoodiUrit: ['opetuspaikkakk_1#1'],
            opetusaikaKoodiUri: 'opetusaikakk_1#1',
            opetuskieletKuvaus: { fi: 'Opetuskieli kuvaus' },
            opetustapaKuvaus: { fi: 'Opetustapa kuvaus' },
            opetusaikaKuvaus: { fi: 'Opetusaika kuvaus' },
            maksullisuusKuvaus: { fi: 'Maksullisuus kuvaus' },
            alkamisaikaKuvaus: { fi: 'Alkamisaika kuvaus' },
            alkamiskausiKoodiUri: 'kausi_1#1',
            alkamisvuosi: '2024',
            onkoLukuvuosimaksua: true,
            lukuvuosimaksu: { fi: '30' },
            lukuvuosimaksuKuvaus: { fi: 'Lukuvuosimaksu kuvaus' },
            onkoStipendia: true,
            stipendinKuvaus: { fi: 'Stipendin kuvaus' },
            stipendinMaara: { fi: '90' },
          },
          osaamisalat: [],
          yhteystieto: {
            nimi: { fi: 'Sami Raunio' },
            titteli: { fi: 'hakuhemmo' },
            sahkoposti: { fi: 'hakutoimisto@salpaus.fi' },
            puhelinnumero: { fi: '123456' },
            wwwSivu: { fi: 'www.salpaus.fi' },
          },
          ammattinimikkeet: [{ kieli: 'fi', arvo: 'eläintenhoitaja' }],
          asiasanat: [
            { kieli: 'fi', arvo: 'koira' },
            { kieli: 'fi', arvo: 'eläintenhoito' },
          ],
          ylemmanKorkeakoulututkinnonOsaamisalat: [
            {
              kuvaus: { fi: 'osaamisalan kuvaus' },
              nimi: { fi: 'osaamisalan nimi' },
              linkki: { fi: 'linkki' },
              otsikko: { fi: 'osaamisalan otsikko' },
            },
          ],
          alemmanKorkeakoulututkinnonOsaamisalat: [
            {
              kuvaus: { fi: 'osaamisalan kuvaus' },
              nimi: { fi: 'osaamisalan nimi' },
              linkki: { fi: 'linkki' },
              otsikko: { fi: 'osaamisalan otsikko' },
            },
          ],
          kuvaus: { fi: 'Toteutuksen kuvaus' },
          tyyppi: 'yo',
        },
        muokkaaja: '1.2.246.562.24.62301161440',
        organisaatioOid: '1.1.1.1.1.1',
        kielivalinta: ['fi', 'sv'],
        modified: '2019-03-26T10:19',
      });
    });
  });
});
