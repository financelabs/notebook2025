import React, { useState } from 'react';

import {
    usePlatform,
    useAdaptivityConditionalRender,
    SplitLayout,
    Panel,
    PanelHeader,
    Group,
    Cell,
    SplitCol,
    Epic,
    Tabbar,
    TabbarItem,
    Placeholder,
    View,
    PanelHeaderBack

} from '@vkontakte/vkui';

import {
    Icon28NewsfeedOutline,
    Icon28ServicesOutline,
    Icon56NewsfeedOutline
} from "@vkontakte/icons"

import VKUIPagination from './VKUIPagination';
import VKUIUpdateQuizLayout from './VKUIUpdateQuiz';
import VKUIQuizCardLayout from './VKUIQuizCard';

const VKUIEpicVeiwUpdateQuiz = () => {
    const platform = usePlatform();
    const { viewWidth } = useAdaptivityConditionalRender();
    const [activeStory, setActiveStory] = useState('profile');

    const activeStoryStyles = {
        backgroundColor: 'var(--vkui--color_background_secondary)',
        borderRadius: 8,
    };

    const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);
    const hasHeader = platform !== 'vkcom';

    function noop() {
        console.log("value")
    }

    return <SplitLayout header={hasHeader && <PanelHeader delimiter="none" />} center>
        {viewWidth.tabletPlus && (
            <SplitCol className={viewWidth.tabletPlus.className} fixed width={280} maxWidth={280}>
                <Panel>
                    {hasHeader && <PanelHeader />}
                    <Group>
                        <Cell
                            disabled={activeStory === 'feed'}
                            style={activeStory === 'feed' ? activeStoryStyles : undefined}
                            data-story="viewmode"
                            onClick={onStoryChange}
                            before={<Icon28NewsfeedOutline />}
                        >
                            View
                        </Cell>
                        <Cell
                            disabled={activeStory === 'services'}
                            style={activeStory === 'services' ? activeStoryStyles : undefined}
                            data-story="editmode"
                            onClick={onStoryChange}
                            before={<Icon28ServicesOutline />}
                        >
                            Edit
                        </Cell>

                    </Group>
                </Panel>
            </SplitCol>
        )}

        <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
            <Epic
                activeStory={activeStory}
                tabbar={
                    viewWidth.tabletMinus && (
                        <Tabbar className={viewWidth.tabletMinus.className}>
                            <TabbarItem
                                onClick={onStoryChange}
                                selected={activeStory === 'feed'}
                                data-story="viewmode"
                                label="Новости"
                            >
                                <Icon28NewsfeedOutline />
                            </TabbarItem>
                            <TabbarItem
                                onClick={onStoryChange}
                                selected={activeStory === 'services'}
                                data-story="editmode"
                                label="Сервисы"
                            >
                                <Icon28ServicesOutline />
                            </TabbarItem>

                        </Tabbar>
                    )
                }
            >
                <View id="viewmode" activePanel="viewmode">
                    <Panel id="viewmode">
                        <PanelHeader>
                            <VKUIPagination />
                        </PanelHeader>
                        <Group style={{ height: '900px' }}>
                        <VKUIQuizCardLayout />
                            {/* <Placeholder icon={<Icon56NewsfeedOutline width={56} height={56} />} /> */}
                        </Group>
                    </Panel>
                </View>
                <View id="editmode" activePanel="editmode">
                    <Panel id="editmode">
                        <PanelHeader>                       
                            <VKUIPagination />                       
                        </PanelHeader>
                        <Group style={{ height: '900px' }}>
                            {/* <Placeholder icon={<Icon28ServicesOutline width={56} height={56} />}></Placeholder> */}
                            <VKUIUpdateQuizLayout />
                        </Group>
                    </Panel>
                </View>

            </Epic>
        </SplitCol>
    </SplitLayout>

}

export default VKUIEpicVeiwUpdateQuiz