import React, { useState, useCallback, useReducer } from 'react';
import { debounce } from 'lodash-es';
import { produce } from "immer"
import { useSelector, useDispatch } from "react-redux";

import { selectActivePage } from '../features/application/applicationSlice';
import { useFetchQuizesArrayQuery } from '../services/fincalculations';

import { Div, Placeholder, FormItem, Input, Button, Textarea } from '@vkontakte/vkui';
import { Icon56ArticleOutline } from '@vkontakte/icons';

const VKUIUpdateQuizLayout = () => {
    const { data } = useFetchQuizesArrayQuery();
    const activePage = useSelector(selectActivePage);

    if (!activePage || activePage === 0) {
        return <Placeholder icon={<Icon56ArticleOutline />}>
            Выберите тест
        </Placeholder>
    }

    return <VKUIUpdateQuiz key={activePage} formObject={data[activePage]} />

}


const VKUIUpdateQuiz = ({ formObject }) => {

    const [myFormData, setFormData] = useState({
        ...formObject
    });

    const debouncedUpdate = debounce(
        (name, value) => {
           console.log(name, value)},
           2500);

    const onChange = (e) => {
        const { name, value } = e.currentTarget;
        // const setStateAction = setStateActionsMap[name];
        // setStateAction && setStateAction(value);
        setFormData(produce((draft) => {
            draft[name] = value;
        }))
        debouncedUpdate(name, value)
    };

    function onSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)

        const formValues = Object.fromEntries(formData)
        console.log(formValues) // output: { name: 'my name', email: 'name@someemail.com' }
    }


    return <Div>
        <form onSubmit={(e) => onSubmit(e)}>

            <FormItem
                htmlFor="title"
                top="title"
                status={'valid'} //emailError ? 'error' : 'valid'
                bottom={'Title'} //emailError ? ERRORS_MAP[emailError] : 'Электронная почта введена верно!'
                bottomId="quiz-title"
                required
            >
                <Input
                    aria-labelledby="quiz-title"
                    id="title"
                    type="text"
                    name="title"
                    value={myFormData?.title}
                    required
                    onChange={onChange}
                />
            </FormItem>

            <FormItem
                htmlFor="text"
                top="text"
                status={'valid'} //emailError ? 'error' : 'valid'
                bottom={'Text'} //emailError ? ERRORS_MAP[emailError] : 'Электронная почта введена верно!'
                bottomId="quiz-text"
                required
            >
                <Input
                    aria-labelledby="quiz-text"
                    id="text"
                    type="text"
                    name="text"
                    value={myFormData?.text}
                    required
                    onChange={onChange}
                />
            </FormItem>

            <FormItem
                top={
                    <FormItem.Top>
                        <FormItem.TopLabel htmlFor="hint">Hint</FormItem.TopLabel>
                        <FormItem.TopAside>html markup</FormItem.TopAside>
                    </FormItem.Top>
                }
            >
                <Textarea
                    id="hint"
                    name="hint"
                    maxLength={2000}
                    value={myFormData?.hint}
                    onChange={onChange}
                    placeholder="html markup..."
                />
            </FormItem>


            <FormItem>
                <Button type="submit" size="l" stretched>
                    Update Quiz
                </Button>
            </FormItem>



        </form>
    </Div>
}

export default VKUIUpdateQuizLayout