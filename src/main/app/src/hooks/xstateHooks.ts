import {
  useMachine as useXstateMachine,
  useService as useXstateService,
} from '@xstate/react';
import { isDev } from '#/src/utils';

export const useMachine = (machine, options) =>
  useXstateMachine(machine, {
    devTools: isDev,
    ...options,
  });

export const useService = (machine, options) =>
  useXstateService(machine, {
    devTools: isDev,
    ...options,
  });
