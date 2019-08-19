const scrollElementIntoView = element => {
  try {
    element.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {}
};

export default scrollElementIntoView;
