import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './configureStore';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Index from './Index';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { muiTheme } from './theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AddressBulldozer from '../internalServices/addressBulldozer/app';
import TimeChanger from '../internalServices/timeChanger/app';
import MenuChanger from '../internalServices/menuChanger/app';
import forceSMSAuth from '../internalServices/forceSMSAuth/app';
import thirdPartyOrderService from '../internalServices/thirdPartyOrderService/app';
import collectionThirdPartyOrder from '../internalServices/collectionThirdPartyOrder/app';
import showUserOrderDetails from '../internalServices/showUserOrderDetail/app';
import MenuManager from '../internalServices/menuManager/app';
import tastingOrderer from '../internalServices/tastingOrderer/app';
import B2BManager from '../internalServices/B2BManager/app';
import userManagement from '../internalServices/userManagement/app';

injectTapEventPlugin();
const store = configureStore();
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

export default function Root() {
  return (
    <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
      <Provider store={store}>
        {}
        <Router history={history}>
          <Route path="/" component={Index} />
          <Route path="/addressBulldozer" component={AddressBulldozer} />
          <Route path="/timeChanger" component={TimeChanger} />
          <Route path="/thirdPartyOrderService" component={thirdPartyOrderService} />
          <Route path="/menuChanger" component={MenuChanger} />
          <Route path="/forceSMSAuth" component={forceSMSAuth} />
          <Route path="/showUserOrderDetail" component={showUserOrderDetails} />
          <Route path="/menuManager" component={MenuManager} />
          <Route path="/tastingOrderer" component={tastingOrderer} />
          <Route path="/collectionThirdPartyOrder" component={collectionThirdPartyOrder} />
          <Route path="/B2BManager" component={B2BManager} />
          <Route path="/userManagement" component={userManagement} />
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}
