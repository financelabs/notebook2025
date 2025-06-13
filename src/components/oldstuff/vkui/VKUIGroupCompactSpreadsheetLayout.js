import * as React from 'react';
import {
    Header,
    Group,
    FormItem,
    Input
   
} from '@vkontakte/vkui';
//import '@vkontakte/vkui/dist/vkui.css';

const VKUIGroupCompactSpreadsheetLayout = () => {

    const onChange = (e) => {
        const { name, value } = e.currentTarget;
        const setStateAction = setStateActionsMap[name];
        setStateAction && setStateAction(value);
    };

    return <Group header={<Header size="s">Form</Header>}>
        <form onSubmit={(e) => e.preventDefault()}>
            <FormItem
                htmlFor="A1"
                top="A1: "
                status={emailError ? 'error' : 'valid'}
                bottom={emailError ? ERRORS_MAP[emailError] : 'Электронная почта введена верно!'}
                bottomId="email-type"
                required
            >
                <Input
                    aria-labelledby="email-type"
                    id="A1"
                    type="text"
                    name="A1"
                    value={email}
                    required
                    onChange={onChange}
                />
            </FormItem>

        </form>
    </Group>
}

export default VKUIGroupCompactSpreadsheetLayout
