const hakukohde = () => ({
  oid: '1.2.246.562.20.00000000000000000030',
  toteutusOid: '1.2.246.562.17.00000000000000000001',
  hakuOid: '1.2.246.562.29.00000000000000000001',
  tila: 'tallennettu',
  nimi: { fi: 'Hakukohteen nimi' },
  alkamiskausiKoodiUri: 'kausi_k#1',
  alkamisvuosi: '2024',
  hakulomake: {},
  aloituspaikat: 150,
  ensikertalaisenAloituspaikat: 49,
  kaytetaanHaunAlkamiskautta: false,
  pohjakoulutusvaatimusKoodiUrit: ['pohjakoulutusvaatimuskouta_0#1'],
  pohjakoulutusvaatimusTarkenne: {
    fi: '<p>Fi tarkenne</p>',
  },
  muuPohjakoulutusvaatimus: {},
  toinenAsteOnkoKaksoistutkinto: true,
  kaytetaanHaunAikataulua: false,
  liitteetOnkoSamaToimitusaika: false,
  liitteetOnkoSamaToimitusosoite: false,
  liitteidenToimitusosoite: null,
  liitteidenToimitustapa: null,
  liitteet: [
    {
      id: '927ac923-a839-4354-9db4-f95d276d9902',
      tyyppiKoodiUri: 'liitetyypitamm_4#1',
      nimi: { fi: 'Nimi' },
      kuvaus: { fi: 'Kuvaus' },
      toimitusaika: '2011-11-11T10:30',
      toimitusosoite: {
        osoite: {
          osoite: { fi: 'Osoite' },
          postinumeroKoodiUri: 'posti_00350#2',
        },
        sahkoposti: 'sahkoposti@email.com',
      },
      toimitustapa: 'osoite',
    },
  ],
  metadata: {
    valintakokeidenYleiskuvaus: {
      fi: '<p>Valintakokeiden kuvaus - fi</p>',
    },
  },
  valintakokeet: [
    {
      nimi: {
        fi: 'Kokeen nimi - fi',
      },
      metadata: {
        tietoja: {
          fi: '<p>Tietoa kokeesta - fi</p>',
        },
        liittyyEnnakkovalmistautumista: true,
        ohjeetEnnakkovalmistautumiseen: {
          fi: '<p>Ohjeet ennakkovalmistautumiseen - fi</p>',
        },
        erityisjarjestelytMahdollisia: true,
        ohjeetErityisjarjestelyihin: {
          fi: '<p>Ohjeet erityisjärjestelyihin - fi</p>',
        },
      },
      tyyppiKoodiUri: 'tyyppi_1#1',
      tilaisuudet: [
        {
          osoite: {
            osoite: { fi: 'fi osoite' },
            postinumeroKoodiUri: 'posti_00350#1',
          },
          aika: {
            alkaa: '2019-04-16T08:44',
            paattyy: '2019-04-18T08:44',
          },
          lisatietoja: {
            fi: 'fi lisatietoja',
          },
          jarjestamispaikka: {
            fi: 'Jarjestamispaikka - fi',
          },
        },
      ],
    },
  ],
  hakuajat: [{ alkaa: '2011-11-11T10:30', paattyy: '2011-11-12T11:45' }],
  muokkaaja: '1.2.246.562.24.62301161440',
  organisaatioOid: '1.2.246.562.10.594252633210',
  kielivalinta: ['fi', 'sv'],
  modified: '2019-04-04T08:28',
  kaytetaanHaunHakulomaketta: false,
  hakulomaketyyppi: 'ataru',
  hakulomakeAtaruId: '12345',
  hakulomakeKuvaus: {},
  hakulomakeLinkki: {},
  valintaperusteId: 'b9d53560-a7f0-45d3-bd9d-46e67e6049ba',
});

export default hakukohde;
