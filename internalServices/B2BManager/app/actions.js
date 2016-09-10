export const Actions = {
  RECEIVE_MENU_DAILY: 'RECEIVE_MENU_DAILY',
};

function receiveMenuDaily(menu) {
  return {
    type: Actions.RECEIVE_MENU_DAILY,
    menu,
  }
}

export function fetchMenuDaily() {
  return (dispatch) =>
    fetch('B2BManager/menuDaily/', {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(res => {
        if (res.status >= 400) {
          return Promise.reject(new Error('Menu Daily 테이블을 가져올 수 없습니다.'));
        }
        return res.json();
      })
      .then(res => {
        return dispatch(receiveMenuDaily(res.message))
      });
}

export function setFeatured (idx) {
  return (dispatch) =>
    fetch(`B2BManager/setFeatured/${idx}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(res => {
        if (res.status >= 400) {
          return Promise.reject(new Error('setFeatured error'));
        }
        return res.json();
      })
      .then(res => {
        return Promise.resolve();
      });
}

export function cancleFeatured (idx) {
  return (dispatch) =>
    fetch(`B2BManager/cancleFeatured/${idx}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(res => {
        if (res.status >= 400) {
          return Promise.reject(new Error('cancleFeatured error'));
        }
        return res.json();
      })
      .then(res => {
        return Promise.resolve();
      });
}