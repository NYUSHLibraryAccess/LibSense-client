import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from 'antd';

const FuzzySearch: React.FC<{ className?: string }> = ({ className }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(searchParams.get('search') ?? '');
  }, [searchParams]);

  return (
    <Input.Search
      placeholder="Search orders..."
      allowClear
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      enterButton={(searchParams.get('search') ?? '') !== inputValue}
      onSearch={(value) => {
        if (value) {
          searchParams.set('search', value);
        } else {
          searchParams.delete('search');
        }
        setSearchParams(searchParams);
      }}
      className={className}
    />
  );
};

export { FuzzySearch };
