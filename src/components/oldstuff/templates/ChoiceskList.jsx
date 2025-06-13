import { useState } from 'react';
//import { useChoices, useChoicesDispatch } from './ChoicesContext.js';
import { useChoices, useChoicesDispatch } from '../features/choices/ChoicesContext.js';

export default function ChoiceList() {
  const choicesState = useChoices();
  console.log(choicesState);
  return (
    <div className='container'>
      {!!choicesState?.choices && choicesState.choices.map(choice => (
        <div key={choice.id} className='p-1'>
          <Choice choice={choice} />
        </div>
      ))}
    </div>
  );
}

function Choice({ choice }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useChoicesDispatch();
  let choiceContent;
  if (isEditing) {
    choiceContent = (
      <>
        <input
          class="form-control form-control-sm"
          value={choice.text}
          onChange={e => {
            dispatch({
              type: "UPDATE_ITEM_IN_ARRAY",
              payload: {
                arrayName: "choices",
                  item: {
                  ...choice,
                  text: e.target.value
                }

              }
            });
            // dispatch({
            //   type: 'changed',
            //   choice: {
            //     ...choice,
            //     text: e.target.value
            //   }
            // });
          }} />
        <button
          className='btn btn-sm btn-outline-secondary m-1'
          onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    choiceContent = (
      <>
        <span className='mx-1'>{choice.text}</span>
        <button
          className='btn btn-sm btn-outline-secondary m-1'
          onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <div className='d-flex'>
      <input
        type="checkbox"
        class="form-check-input"
        checked={choice.isRight}
        onChange={e => {
          dispatch({
            type: "UPDATE_ITEM_IN_ARRAY",
            payload: {
              arrayName: "choices",

              item: {
                ...choice,
                isRight: e.target.checked
              }

            }
          });
          // dispatch({
          //   type: 'changed',
          //   choice: {
          //     ...choice,
          //     isRight: e.target.checked
          //   }
          // });
        }}
      />
      <span className='mx-1'>{choiceContent}</span>
      <button
        className='btn btn-sm btn-outline-danger m-1'
        onClick={() => {
          
          dispatch({
            type: "DELETE_ITEM_FROM_ARRAY",
            payload: {
              arrayName: "choices",
              id: choice.id
            }
          });

        }}>
        Delete
      </button>
    </div>
  );
}