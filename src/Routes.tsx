import React from 'react';

import { BrowserRouter, Route, Routes as RoutesList } from 'react-router-dom';
import Dashboard from 'layouts/Dashboard';
import Page from 'layouts/Page';

import ROUTES from 'config/routes';

function Routes() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <RoutesList>
        <Route element={<Dashboard />}>
          {Object.entries(ROUTES).map(([path, { title, Component, Table, filters }]) => (
            <Route
              key={path}
              path={path}
              element={
                <Page title={title}>
                  <Component />
                </Page>
              }
            >
              {Object.entries(filters).map(([filterPath, filter]) => (
                <Route key={filterPath} path={filterPath} element={<Table filter={filter} />} />
              ))}
            </Route>
          ))}
        </Route>
      </RoutesList>
    </BrowserRouter>
  );
}

export default Routes;
