import { assign, createActor, createMachine } from 'xstate';

import { inspect } from '#/src/utils/xstateInspector';

type FilterValues = Record<string, unknown>;
type FilterContext = { values: FilterValues };
type SetValuesEvent = { type: 'SET_VALUES'; values: FilterValues };

const createFilterMachine = (initialValues: FilterValues) =>
  createMachine({
    types: {
      context: {} as FilterContext,
      events: {} as SetValuesEvent,
    },
    context: { values: initialValues },
    on: {
      SET_VALUES: {
        actions: assign({
          values: ({ context, event }) => ({
            ...context.values,
            ...event.values,
          }),
        }),
      },
    },
  });

export const hakuMachine = createFilterMachine({
  page: 0,
  nimi: '',
  tila: [],
  orderBy: '',
  hakutapa: [],
  koulutuksenAlkamiskausi: null,
  koulutuksenAlkamisvuosi: [],
});

export const hakukohdeMachine = createFilterMachine({
  page: 0,
  nimi: '',
  hakuNimi: '',
  koulutustyyppi: [],
  tila: [],
  orgWhitelist: [],
  orderBy: '',
});

export const koulutusMachine = createFilterMachine({
  page: 0,
  nimi: '',
  koulutustyyppi: [],
  tila: [],
  nakyvyys: null,
  orderBy: '',
});

export const toteutusMachine = createFilterMachine({
  page: 0,
  nimi: '',
  koulutustyyppi: [],
  tila: [],
  orderBy: '',
});

export const valintaperusteMachine = createFilterMachine({
  page: 0,
  nimi: '',
  koulutustyyppi: [],
  tila: [],
  nakyvyys: null,
  orderBy: '',
});

const startFilterService = (machine: ReturnType<typeof createFilterMachine>) =>
  createActor(machine, inspect ? { inspect } : undefined).start();

export const hakuService = startFilterService(hakuMachine);
export const hakukohdeService = startFilterService(hakukohdeMachine);
export const koulutusService = startFilterService(koulutusMachine);
export const toteutusService = startFilterService(toteutusMachine);
export const valintaperusteService = startFilterService(valintaperusteMachine);
