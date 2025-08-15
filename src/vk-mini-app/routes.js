import { createHashParamRouter } from '@vkontakte/vk-mini-apps-router';

// Вызов функции 
const router = createHashParamRouter([
  {
    path: '/',
    panel: 'main',
    view: 'main',
  },
  {
    path: '/contacts',
    panel: 'contacts_panel',
    view: 'contacts_view',
  }
]);

export default router
