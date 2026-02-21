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
    <div style={{ 
      background: 'white', 
      padding: '1rem', 
      borderRadius: '8px',
      margin: '1rem 0',
      textAlign: 'center'
    }}>
      <h3>Contador Redux: {count}</h3>
      <button 
        onClick={() => dispatch(increment())}
        style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}
      >
        +1
      </button>
      <button 
        onClick={() => dispatch(decrement())}
        style={{ padding: '0.5rem 1rem' }}
      >
        -1
      </button>
    </div>
  );
};

export default Counter;