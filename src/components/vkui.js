import * as React from 'react';
import { createRoot } from 'react-dom/client';
import store from './state/store'
import { Provider } from 'react-redux'
import {
    usePlatform,
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
} from '@vkontakte/vkui';
import VKUIPagination from './vkui/VKUIPagination';
import VKUIUpdateQuiz from './vkui/VKUIUpdateQuiz';
import VKUIEpicVeiwUpdateQuiz from './vkui/VKUIEpicVeiwUpdateQuiz';
//import '@vkontakte/vkui/dist/vkui.css';

const Example = () => {
    const platform = usePlatform();

    return (
        <Provider store={store}>
            <AppRoot>
            <VKUIEpicVeiwUpdateQuiz />
            {/* <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
                <SplitCol autoSpaced>
                    <View activePanel="main">
                        <Panel id="main">
                            <PanelHeader>Current Day Quiz</PanelHeader>
                            <Group header={<Header size="s">Quizes</Header>}>
                                <VKUIPagination />
                            </Group>
                            <Group header={<Header size="s">Update Quiz</Header>}>
                                <VKUIUpdateQuiz />
                            </Group>                            
                        </Panel>
                        <Panel id="compactspreadsheet">
                            <PanelHeader>Compact spreadsheet</PanelHeader>           
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout> */}
        </AppRoot>
        </Provider>    
        
    );
};

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <ConfigProvider>
        <AdaptivityProvider>
            <Example />
        </AdaptivityProvider>
    </ConfigProvider>,
);