import React, { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client';

import { RouterProvider, useActiveVkuiLocation, useGetPanelForView } from '@vkontakte/vk-mini-apps-router';

import {
  AdaptivityProvider,
  ConfigProvider,
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  SimpleCell,
  usePlatform
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import router from './vk-mini-app/routes';


function App() {
      const platform = usePlatform();
  const [count, setCount] = useState(0);

  // Получение информации о View и Panel  
  const { view: activeView } = useActiveVkuiLocation();
  const activePanel = useGetPanelForView('default_view'); 

  console.log(activeView, activePanel)

  return <AppRoot>
      <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
        <SplitCol autoSpaced>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>VKUI</PanelHeader>
              <Group header={<Header mode="secondary">Items</Header>}>
                <SimpleCell>Hello</SimpleCell>
                <SimpleCell>World</SimpleCell>
              </Group>
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  
  
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
   
}

createRoot(document.getElementById('root')).render(
  <ConfigProvider>
    <RouterProvider router={router}>
 <AdaptivityProvider>
      <App />
    </AdaptivityProvider>
    </RouterProvider>
   
  </ConfigProvider>,
)


