import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  selectCount,
} from './cdnCounterSlice';

let { useSelector, useDispatch } = ReactRedux;
let { useState } = React;
let { Card } = ReactBootstrap;

export function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  return (
    <Card style={{ width: '800px' }}>
  <Card.Img variant="top"
   src="https://images.unsplash.com/photo-1456574808786-d2ba7a6aa654?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
  <Card.Body>
    <Card.Title>Features Counter.jsx</Card.Title>
   
    <div className='container'>
        <button
        className='btn btn-sm btn-outline-secondary m-1'
          
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span >{count}</span>
        <button
         className='btn btn-sm btn-outline-secondary m-1'
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      <div className='container'>
        <input
       class="form-control"
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={e => setIncrementAmount(e.target.value)}
        />
        <button
        className='btn btn-sm btn-outline-secondary m-1'
          onClick={() =>
            dispatch(incrementByAmount(Number(incrementAmount) || 0))
          }
        >
          Add Amount
        </button>
        <button
          className='btn btn-sm btn-outline-secondary m-1'
          onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
        >
          Add Async
        </button>
      </div>
   
  </Card.Body>
</Card>

   
  );
}
