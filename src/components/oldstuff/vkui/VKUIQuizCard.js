import React, { useState } from 'react';
import { useFetchQuizesArrayQuery } from '../services/fincalculations';
import { useSelector } from 'react-redux';

import { selectActivePage } from '../features/application/applicationSlice';

import {
    Placeholder,
    Card,
    SimpleCell,
    Div

} from '@vkontakte/vkui';

import { Icon56ArticleOutline } from '@vkontakte/icons';


const VKUIQuizCardLayout = () => {
    const { data } = useFetchQuizesArrayQuery();
    const activePage = useSelector(selectActivePage);

    if (!activePage || activePage === 0) {
        return <Placeholder icon={<Icon56ArticleOutline />}>
            Выберите тест
        </Placeholder>
    }

    return <VKUIQuizCard key={activePage} formObject={data[activePage]} />

}





const VKUIQuizCard = ({ formObject }) => {
    return <Card>
        <Div>
            {formObject.title}
        </Div>
        <Div>
            {formObject.theme}
        </Div>
        <Div>
            {formObject.text}
        </Div>
        <Div>
            {formObject.hint}
        </Div>
    </Card>
}

export default VKUIQuizCardLayout