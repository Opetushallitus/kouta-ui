import { type Page } from '@playwright/test';

import { stubKayttoOikeusOmatTiedot } from '#/playwright/stubKayttoOikeusOmatTiedot';

export const stubOrgPaakayttajaRights = (page: Page, organisaatioOid: string) =>
  stubKayttoOikeusOmatTiedot(page, [
    {
      organisaatioOid,
      kayttooikeudet: [
        {
          palvelu: 'KOUTA',
          oikeus: 'KOULUTUS_CRUD',
        },
        {
          palvelu: 'KOUTA',
          oikeus: 'TOTEUTUS_CRUD',
        },
        {
          palvelu: 'KOUTA',
          oikeus: 'HAKUKOHDE_CRUD',
        },
        {
          palvelu: 'KOUTA',
          oikeus: 'HAKU_CRUD',
        },
        {
          palvelu: 'KOUTA',
          oikeus: 'VALINTAPERUSTE_CRUD',
        },
        {
          palvelu: 'KOUTA',
          oikeus: 'OPPILAITOS_CRUD',
        },
      ],
    },
  ]);
