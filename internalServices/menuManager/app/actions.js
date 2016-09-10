export const Actions = {
  SELECT_MENU: 'SELECT_MENU',
  INITIALIZE: 'INITIALIZE',
};

export function initialize() {
  return {
    type: Actions.INITIALIZE,
  }
}

export function selectMenu(selectedMenu) {
  return {
    type: Actions.SELECT_MENU,
    selectedMenu,
  };
}