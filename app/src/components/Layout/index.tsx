import React from 'react';
import Progress from 'components/Progress';
import Navbar from 'components/Navbar';
import Queue from 'components/Queue';
import InfoLabel from 'components/InfoLabel';

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
