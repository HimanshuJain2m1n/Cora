import React from 'react'

export const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option",
  name,
  id,
  className,
  style
}) => {
  return (
    <div className="custom-select-container" style={{ width: '100%', ...style }}>
      <select
        name={name}
        id={id}
        className={`custom-select ${className || ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #d9d9d9',
          backgroundColor: '#fff',
          fontSize: '14px',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options && options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;