import { isCypress } from '#/src/utils';

const SCROLL_OPTIONS = isCypress ? {} : { behavior: 'smooth' };

const scrollElementIntoView = (element, delay = 0) => {
  setTimeout(() => {
    try {
      element.scrollIntoView(SCROLL_OPTIONS);
    } catch (e) {}
  }, delay);
};

export default scrollElementIntoView;
