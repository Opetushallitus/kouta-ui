import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const MainPage = () => {
  return (
    <Router basename="/kouta">
      <div>Hello world!</div>
    </Router>
  );
};

export default MainPage;
