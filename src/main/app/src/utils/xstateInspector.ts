import { createBrowserInspector } from '@statelyai/inspect';

const inspector = import.meta.env.VITE_XSTATE_INSPECTOR
  ? createBrowserInspector({ iframe: null }) // open in new window
  : undefined;

export const inspect = inspector?.inspect;
