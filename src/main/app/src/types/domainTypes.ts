import { components } from './kouta-backend.api';

export type KoulutusModel = components['schemas']['Koulutus'];

export type ToteutusModel = components['schemas']['Toteutus'];

export type HakuModel = components['schemas']['Haku'];

export type HakukohdeModel = components['schemas']['Hakukohde'];

export type ValintaperusteModel = components['schemas']['Valintaperuste'];

export type SoraKuvausModel = components['schemas']['Sorakuvaus'];

export type OppilaitosModel = components['schemas']['Oppilaitos'];

export type OppilaitoksenOsaModel = components['schemas']['OppilaitoksenOsa'];

export type EntityModelBase = {
  nimi?: components['schemas']['Nimi'];
  tila?: components['schemas']['Julkaisutila'];
  _enrichedData?: {
    esitysnimi?: components['schemas']['Nimi'];
  };
  muokkaaja?: string;
  modified?: string;
};
