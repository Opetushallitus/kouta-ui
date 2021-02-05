import { useMachine as useXstateMachine } from '@xstate/react';

import { isDev } from '#/src/utils';

export const useMachine = (machine, options) =>
  useXstateMachine(machine, {
    devTools: isDev,
    ...options,
  });
