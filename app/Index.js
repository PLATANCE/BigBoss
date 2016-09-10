import React from 'react';
import { Link } from 'react-router';
import OrderTable from "../internalServices/orderTable/app"

export default function Index() {
  return (
    <div className="container">
      <div>
        <h1>BigBoss System</h1>
        <ul>
          <li>주소 변환 - <Link to={'/addressBulldozer'}>'/addressBulldozer'</Link></li>
          <li>주문시간 수정 - <Link to={'/timeChanger'}>'/timeChanger'</Link></li>
          <li>외부 배달 접수 - <Link to={'/thirdPartyOrderService'}>'/thirdPartyOrderService'</Link></li>
          <li>주문메뉴 수정 - <Link to={'/menuChanger'}>'/menuChanger'</Link></li>
          <li>SMS 인증 - <Link to={'/forceSMSAuth'}>'/forceSMSAuth'</Link></li>
          <li>사용자 주문 정보 조회 - <Link to={'/showUserOrderDetail'}>'/showUserOrderDetail'</Link></li>
          <li>음식메뉴 관리 - <Link to={'/menuManager'}>'/menuManager'</Link></li>
          <li>테이스 관리 - <Link to={'/tastingOrderer'}>'/tastingOrderer'</Link></li>
          <li>외부 배달 일괄접수 - <Link to={'/collectionThirdPartyOrder'}>'/collectionThirdPartyOrder'</Link></li>
          <li>회원 관리 - <Link to={'/userManagement'}>'/userManagement'</Link></li>
        </ul>
      </div>
      <hr />
      <div>
        <Link to={'/B2BManager'}>B2B 관리</Link>
      </div>

      <OrderTable />
    </div>


  );
}
