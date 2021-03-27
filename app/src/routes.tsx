import { useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Layout from 'components/Layout';
import Search from 'components/Search';
import { InfoQueueContext } from 'contexts/InfoQueueContext';

export default function Routes() {
  const { curSearch } = useContext(InfoQueueContext);
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Layout} path="/" exact />
        <Route component={Search} path="/search"></Route>
      </Switch>
      {curSearch ? <Redirect to="/search" /> : <Redirect to="/" />}
    </BrowserRouter>
  );
}
