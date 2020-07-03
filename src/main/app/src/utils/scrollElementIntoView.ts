const scrollElementIntoView = (element, delay = 0) => {
  setTimeout(() => {
    try {
      element.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {}
  }, delay);
};

export default scrollElementIntoView;
