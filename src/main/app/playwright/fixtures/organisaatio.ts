export default ({
  oid = '1.2.246.562.10.594252633210',
} = {}): Serializable => ({
  oid,
  nimi: { fi: 'Organisaatio' },
  metadata: {
    nimi: {},
    hakutoimistonNimi: {},
    yhteystiedot: [],
    hakutoimistoEctsEmail: {},
    hakutoimistoEctsNimi: {},
    hakutoimistoEctsPuhelin: {},
    hakutoimistoEctsTehtavanimike: {},
    luontiPvm: 1376464481941,
    muokkausPvm: 1376464481941,
    data: {},
  },
  parentOidPath: `|1.2.246.562.10.00000000001|`,
  parentOid: '1.2.246.562.10.00000000001',
  status: 'AKTIIVINEN',
  yhteystiedot: {
    postiosoite: {
      osoite: {
        fi: 'Horonpohjantie 279',
      },
      postinumeroKoodiUri: {
        fi: 'posti_40101',
      },
    },
    kayntiosoite: {
      osoite: {
        fi: "'Verhonkulmala 220",
      },
      postinumeroKoodiUri: {
        fi: 'posti_40720',
      },
    },
    puhelinnumero: {
      fi: '050 28144921',
    },
    sahkoposti: {
      fi: 'hakija-31832505@oph.fi',
    },
    wwwOsoite: {
      fi: 'https://www.sivusto.fi',
    },
  },
});
