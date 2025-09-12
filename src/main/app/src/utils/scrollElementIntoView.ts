import { isPlaywright } from '#/src/utils';

const SCROLL_OPTIONS: ScrollIntoViewOptions = isPlaywright
  ? {}
  : { behavior: 'smooth' };

const scrollElementIntoView = (element: HTMLElement | null, delay = 0) => {
  setTimeout(() => {
    try {
      element?.scrollIntoView(SCROLL_OPTIONS);
    } catch {}
  }, delay);
};

export default scrollElementIntoView;
