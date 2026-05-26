// External Lib Import
import MenuItems from "../constants/menu";

/**
 * Dynamic menu filtering based on the authenticated user's role
 * @param {string} role - The current user's role (e.g., 'ADMIN', 'HOD', 'EMPLOYEE')
 */
const getMenuItems = (role, isAuthenticated, t) => {
  const allItems = MenuItems(t, role, isAuthenticated) || [];
  const userRole = role?.toUpperCase();

  // Recursive function to deeply filter out routes the current role shouldn't see
  const filterByRole = (items) => {
    return items
      .filter((item) => {
        // If the item doesn't have a strict role lock, anyone can see it
        if (!item.role) return true;
        
        // Otherwise, match against the user's logged-in role token
        return item.role.toUpperCase() === userRole;
      })
      .map((item) => {
        // If this layout link has nested child menus, filter those recursively as well
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: filterByRole(item.children),
          };
        }
        return item;
      });
  };

  return filterByRole(allItems);
};

const findAllParent = (menuItems, menuItem) => {
  let parents = [];
  const parent = findMenuItem(menuItems, menuItem["parentKey"]);

  if (parent) {
    parents.push(parent["key"]);
    if (parent["parentKey"])
      parents = [...parents, ...findAllParent(menuItems, parent)];
  }
  return parents;
};

const findMenuItem = (menuItems, menuItemKey) => {
  if (menuItems && menuItemKey) {
    for (var i = 0; i < menuItems.length; i++) {
      if (menuItems[i].key === menuItemKey) {
        return menuItems[i];
      }
      var found = findMenuItem(menuItems[i].children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

export { getMenuItems, findAllParent, findMenuItem };
