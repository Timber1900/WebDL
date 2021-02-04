import React from 'react';
import Progress from '../Progress';
import Navbar from '../Navbar';
import Queue from '../Queue';
import InfoLabel from '../InfoLabel';
import Search from '../Search';

const Layout = () => {
  return (
    <>
      <Progress />
      <Navbar />
      <Queue />
      <InfoLabel />
      <Search />
    </>
  );
};

export default Layout;
