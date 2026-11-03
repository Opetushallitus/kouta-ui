import { useMachine as useXstateMachine } from '@xstate/react';

import { inspect } from '#/src/utils/xstateInspector';

export const useMachine = (machine, options = {}) =>
  useXstateMachine(machine, {
    ...(inspect ? { inspect } : {}),
    ...options,
  });
