import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../store/counterSlice';

// Type of State  (if use TypeScript)
interface RootState {
  counter: {
    value: number;
  };
}

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Redux Counter: {count}</h3>
      <button 
        onClick={() => dispatch(increment())}
      >
        +1
      </button>
      <button 
        onClick={() => dispatch(decrement())}
      >
        -1
      </button>
    </div>
  );
};

export default Counter;