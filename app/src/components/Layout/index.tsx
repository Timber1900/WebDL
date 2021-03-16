import React from 'react';
import Progress from '../Progress';
import Navbar from '../Navbar';
import Queue from '../Queue';
import InfoLabel from '../InfoLabel';

const Layout = () => {
  return (
    <>
      <Progress />
      <Navbar />
      <Queue />
      <InfoLabel />
    </>
  );
};

export default Layout;
