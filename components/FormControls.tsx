import React from 'react';

type NameKey = string;

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: NameKey;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, name, type = 'text', value, onChange, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer"
        placeholder=" " 
        {...props}
      />
      <label
        htmlFor={name}
        className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-orange-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
      >
        {label}
      </label>
    </div>
  );
};

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: NameKey;
    children: React.ReactNode;
    className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, children, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className={`block px-3.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-orange-600 peer ${value ? 'text-gray-900' : 'text-transparent'}`}
        {...props}
      >
        {children}
      </select>
      <label
        htmlFor={name}
        className={`absolute text-sm text-gray-500 duration-300 transform pointer-events-none -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-orange-600 start-1 
        ${value ? 'scale-75 -translate-y-4 top-2' : 'scale-100 -translate-y-1/2 top-1/2'}`}
      >
        {label}
      </label>
    </div>
  );
};
