import React from 'react';
import { Link } from 'react-router';

export default function Index() {
  return (
    <div className="container">
      <div>
        <Link to={'/addressBulldozer'}>'/addressBulldozer'</Link>
        <Link to={'/timeChanger'}>'/timeChanger'</Link>
        <Link to={'/thirdPartyOrderService'}>'/thirdPartyOrderService'</Link>
        <Link to={'/menuChanger'}>'/menuChanger'</Link>
        <Link to={'/forceSMSAuth'}>'/forceSMSAuth'</Link>
        <Link to={'/showUserOrderDetail'}>'/showUserOrderDetail'</Link>
        <Link to={'/menuManager'}>'/menuManager'</Link>
        <Link to={'/tastingOrderer'}>'/tastingOrderer'</Link>
        <Link to={'/collectionThirdPartyOrder'}>'/collectionThirdPartyOrder'</Link>
        <Link to={'/userManagement'}>'/userManagement'</Link>

      </div>
      <hr />
      <div>
        <Link to={'/B2BManager'}>B2B 관리</Link>
      </div>
    </div>


  );
}
