import React from 'react';

import { Navigate, createBrowserRouter, Outlet } from 'react-router-dom';

import RouterScrollToTop from '#/src/components/RouterScrollToTop';
import { Toaster } from '#/src/components/Toaster';
import { ENTITY } from '#/src/constants';

import { CreateHakuPage } from './haku/CreateHakuPage';
import { EditHakuPage } from './haku/EditHakuPage';
import { CreateHakukohdePage } from './hakukohde/CreateHakukohdePage';
import { EditHakukohdePage } from './hakukohde/EditHakukohdePage';
import HomePage from './HomePage';
import { CreateKoulutusPage } from './koulutus/CreateKoulutusPage';
import { EditKoulutusPage } from './koulutus/EditKoulutusPage';
import { OppilaitoksenOsaPage } from './OppilaitoksenOsaPage/OppilaitoksenOsaPage';
import { OppilaitosPage } from './OppilaitosPage/OppilaitosPage';
import { createRedirectEntityPage } from './RedirectEntityPage';
import { CreateSoraKuvausPage } from './soraKuvaus/CreateSoraKuvausPage';
import { EditSoraKuvausPage } from './soraKuvaus/EditSoraKuvausPage';
import { CreateToteutusPage } from './toteutus/CreateToteutusPage';
import { EditToteutusPage } from './toteutus/EditToteutusPage';
import { CreateValintaperustePage } from './valintaperuste/CreateValintaperustePage';
import { EditValintaperustePage } from './valintaperuste/EditValintaperustePage';

const RedirectKoulutusPage = createRedirectEntityPage({
  entityType: ENTITY.KOULUTUS,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/koulutus/${oid}/muokkaus`,
});

const RedirectToteutusPage = createRedirectEntityPage({
  entityType: ENTITY.TOTEUTUS,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
});

const RedirectHakuPage = createRedirectEntityPage({
  entityType: ENTITY.HAKU,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/haku/${oid}/muokkaus`,
});

const RedirectHakukohdePage = createRedirectEntityPage({
  entityType: ENTITY.HAKUKOHDE,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`,
});

const RedirectValintaperustePage = createRedirectEntityPage({
  entityType: ENTITY.VALINTAPERUSTE,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/valintaperusteet/${oid}/muokkaus`,
});

const RedirectSoraKuvausPage = createRedirectEntityPage({
  entityType: ENTITY.SORA_KUVAUS,
  getRedirectUrl: ({ organisaatioOid, oid }) =>
    `/organisaatio/${organisaatioOid}/sora-kuvaus/${oid}/muokkaus`,
});

const Layout = () => {
  return (
    <RouterScrollToTop>
      <Toaster
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: '9999',
        }}
      />
      <Outlet />
    </RouterScrollToTop>
  );
};

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: 'organisaatio/:organisaatioOid/koulutus',
          element: <CreateKoulutusPage />,
        },
        {
          path: 'organisaatio/:organisaatioOid/koulutus/:oid/muokkaus',
          element: <EditKoulutusPage />,
        },
        { path: 'koulutus/:oid', element: <RedirectKoulutusPage /> },
        { path: 'koulutus/:oid/muokkaus', element: <RedirectKoulutusPage /> },

        {
          path: 'organisaatio/:organisaatioOid/koulutus/:koulutusOid/toteutus',
          element: <CreateToteutusPage />,
        },
        {
          path: 'organisaatio/:organisaatioOid/toteutus/:oid/muokkaus',
          element: <EditToteutusPage />,
        },
        { path: 'toteutus/:oid', element: <RedirectToteutusPage /> },
        { path: 'toteutus/:oid/muokkaus', element: <RedirectToteutusPage /> },

        {
          path: 'organisaatio/:organisaatioOid/haku',
          element: <CreateHakuPage />,
        },
        {
          path: 'organisaatio/:organisaatioOid/haku/:oid/muokkaus',
          element: <EditHakuPage />,
        },
        { path: 'haku/:oid', element: <RedirectHakuPage /> },
        { path: 'haku/:oid/muokkaus', element: <RedirectHakuPage /> },

        {
          path: 'organisaatio/:organisaatioOid/toteutus/:toteutusOid/haku/:hakuOid/hakukohde',
          element: <CreateHakukohdePage />,
        },
        {
          path: 'organisaatio/:organisaatioOid/hakukohde/:oid/muokkaus',
          element: <EditHakukohdePage />,
        },
        { path: 'hakukohde/:oid', element: <RedirectHakukohdePage /> },
        {
          path: 'hakukohde/:oid/muokkaus',
          element: <RedirectHakukohdePage />,
        },

        {
          path: 'organisaatio/:organisaatioOid/valintaperusteet/kielivalinnat/:kieliValinnat?',
          element: <CreateValintaperustePage />,
        },
        {
          path: 'organisaatio/:organisaatioOid/valintaperusteet/kielivalinnat/:kieliValinnat/koulutustyyppi/:koulutustyyppi',
          element: <CreateValintaperustePage />,
        },
        {
          path: 'organisaatio/:organisaatioOid/valintaperusteet/:id/muokkaus',
          element: <EditValintaperustePage />,
        },
        {
          path: 'valintaperusteet/:oid',
          element: <RedirectValintaperustePage />,
        },
        {
          path: 'valintaperusteet/:oid/muokkaus',
          element: <RedirectValintaperustePage />,
        },

        {
          path: 'organisaatio/:organisaatioOid/sora-kuvaus/kielivalinnat/:kieliValinnat?',
          element: <CreateSoraKuvausPage />,
        },
        {
          path: 'organisaatio/:organisaatioOid/sora-kuvaus/:id/muokkaus',
          element: <EditSoraKuvausPage />,
        },
        { path: 'sora-kuvaus/:oid', element: <RedirectSoraKuvausPage /> },
        {
          path: 'sora-kuvaus/:oid/muokkaus',
          element: <RedirectSoraKuvausPage />,
        },

        {
          path: 'organisaatio/:organisaatioOid/oppilaitos',
          element: <OppilaitosPage />,
        },

        {
          path: 'organisaatio/:organisaatioOid/oppilaitoksen-osa',
          element: <OppilaitoksenOsaPage />,
        },

        { path: '*', element: <Navigate replace to="/" /> },
      ],
    },
  ],

  { basename: '/kouta/' }
);

export default router;
