import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { View, Panel, PanelHeader, Button } from '@vkontakte/vkui';
var App = function () {
    var _a = useState('panel-1'), activePanel = _a[0], setActivePanel = _a[1];
    return (React.createElement(View, { activePanel: activePanel },
        React.createElement(Panel, { id: "panel-1" },
            React.createElement(PanelHeader, null, "\u041F\u0430\u043D\u0435\u043B\u044C 1"),
            React.createElement(Button, { onClick: function () { return setActivePanel('panel-2'); } }, "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043F\u0430\u043D\u0435\u043B\u0438 2")),
        React.createElement(Panel, { id: "panel-2" },
            React.createElement(PanelHeader, null, "\u041F\u0430\u043D\u0435\u043B\u044C 2"),
            React.createElement(Button, { onClick: function () { return setActivePanel('panel-1'); } }, "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043F\u0430\u043D\u0435\u043B\u0438 1"))));
};
var root = createRoot(document.getElementById('root'));
root.render(React.createElement(App, null));
