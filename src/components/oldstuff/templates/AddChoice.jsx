import { useState } from 'react';
import { useChoicesDispatch } from '../features/choices/ChoicesContext.js';

export default function AddChoice() {
  const [text, setText] = useState('');
  const dispatch = useChoicesDispatch();
  return (
    <>
      <div class="input-group m-1">
        <span class="input-group-text" id="basic-addon1">Choice</span>
        <input type="text" class="form-control" placeholder="Add choice" aria-label="Username" aria-describedby="basic-addon1"
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </div>
      <button
        className='btn btn-sm btn-outline-secondary m-1'
        onClick={() => {
          setText('');

          // dispatch({
          //   type: 'added',
          //   id: nextId++,
          //   text: text,
          // });

          dispatch({
            type: "PUSH_ITEM_TO_ARRAY",
            payload: {
              arrayName: "choices",
              item: {
                id: Math.random() * 100,
                text: text,
              }
            }
          });  
      }}>Add</button >
    <hr />
    </>
  );
}

let nextId = 3;

