import React, { useState} from 'react';
import { createRoot } from 'react-dom/client';
import { View, Panel, PanelHeader, Button } from '@vkontakte/vkui';

const App = () => {
  const [activePanel, setActivePanel] = useState('panel-1');
  return (
    <View activePanel={activePanel}>
      <Panel id="panel-1">
        <PanelHeader>Панель 1</PanelHeader>
        <Button onClick={() => setActivePanel('panel-2')}>Перейти к панели 2</Button>
      </Panel>
      <Panel id="panel-2">
        <PanelHeader>Панель 2</PanelHeader>
        <Button onClick={() => setActivePanel('panel-1')}>Перейти к панели 1</Button>
      </Panel>
    </View>
  );
};
const root = createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));