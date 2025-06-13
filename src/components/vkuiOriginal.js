import * as React from 'react';
import { createRoot } from 'react-dom/client';
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
//import '@vkontakte/vkui/dist/vkui.css';

const Example = () => {
    const platform = usePlatform();

    return (
        <AppRoot>
            <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
                <SplitCol autoSpaced>
                    <View activePanel="compactspreadsheet">
                        <Panel id="main">
                            <PanelHeader>VKUI</PanelHeader>
                            <Group header={<Header size="s">Items</Header>}>
                                <SimpleCell>Hello</SimpleCell>
                                <SimpleCell>World</SimpleCell>
                            </Group>
                        </Panel>
                        <Panel id="compactspreadsheet">
                            <PanelHeader>Compact spreadsheet</PanelHeader>
           
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
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