import React from 'react';
import { InputNumber, Space } from 'antd';

interface CountInputProps {
  variable: string;
  value: number;
  onChange: (value: number | null, variable: string) => void;
}

const CountInput: React.FC<CountInputProps> = ({ variable, value, onChange }) => {
  const handleChange = (value: number | null) => {
    onChange(value, variable);
  };

  return (
    <Space wrap>
      <InputNumber
        size="large"
        min={1}
        max={7}
        value={value}
        onChange={handleChange}
        type="number"
        style={{ textAlign: 'center' }}
      />
    </Space>
  );
};

export default CountInput;