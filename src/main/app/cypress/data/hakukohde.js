export default () => ({
  oid: '1.2.246.562.20.00000000000000000030',
  toteutusOid: '1.2.246.562.17.00000000000000000001',
  hakuOid: '1.2.246.562.29.00000000000000000001',
  tila: 'tallennettu',
  nimi: { fi: 'Hakukohteen nimi' },
  alkamiskausiKoodiUri: 'kausi_0#1',
  alkamisvuosi: '2024',
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
      id: '927ac923-a839-4354-9db4-f95d276d9902',
      tyyppi: 'liitetyypitamm_0#1',
      nimi: { fi: 'Nimi' },
      kuvaus: { fi: 'Kuvaus' },
      toimitusaika: '2011-11-11T10:30',
      toimitusosoite: {
        osoite: {
          osoite: { fi: 'Osoite' },
          postinumero: '00940',
          postitoimipaikka: { fi: 'Postitoimipaikka' },
        },
        sahkoposti: 'sahkoposti@email.com',
      },
    },
  ],
  valintakokeet: [
    {
      id: 'b9d53560-a7f0-45d3-bd9d-46e67e6049ba',
      tyyppi: 'valintakokeentyyppi_0#1',
      tilaisuudet: [
        {
          osoite: {
            osoite: { fi: 'Osoite' },
            postinumero: '00940',
            postitoimipaikka: { fi: 'Postitoimipaikka' },
          },
          aika: { alkaa: '2011-11-11T10:30', paattyy: '2011-11-12T11:45' },
          lisatietoja: { fi: 'Lisätietoja' },
        },
      ],
    },
  ],
  hakuajat: [{ alkaa: '2011-11-11T10:30', paattyy: '2011-11-12T11:45' }],
  muokkaaja: '1.2.246.562.24.62301161440',
  organisaatioOid: '1.2.246.562.10.594252633210',
  kielivalinta: ['fi', 'sv'],
  modified: '2019-04-04T08:28',
  eriHakulomake: true,
  hakulomaketyyppi: 'ataru',
  hakulomakeId: '12345',
  hakulomakeKuvaus: {},
  hakulomakeLinkki: {},
});
