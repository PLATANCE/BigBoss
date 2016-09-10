import { Actions } from './actions';

const defaultState = {
  menu: [],
};

function B2BManager (state = Object.assign({}, defaultState), action) {

  switch (action.type) {
    case Actions.RECEIVE_MENU_DAILY:
      {
        const { menu } = action;
        return Object.assign({}, state, {
          menu,
        });
      }

    default:
      {
        return state;
      }
  }
}

export default B2BManager;
