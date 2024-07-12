import React from 'react';

// Component Slot
const Slot = ({ slots }) => {
  return (
    <div className="w-full">
      {slots.map((slot, index) => (
        <button
          key={index}
          type="button"
          className="ant-btn css-1kq9k6q ant-btn-default rounded-[100px] m-1 min-w-[75px] min-h-[36px] font-bold"
        >
          <span>{slot}</span>
        </button>
      ))}
    </div>
  );
};

export default Slot;
