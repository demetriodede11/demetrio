'use client';

import { useQuery } from '@tanstack/react-query';

import { getFaqList } from '../requests/getFaqList';

export const FaqList = () => {
  const { data, isPending, isFetching, isError, refetch } = useQuery(getFaqList);

  if (isPending || isFetching) {
    return <p role="status">Загрузка</p>;
  }

  if (isError) {
    return (
      <div role="alert">
        <p>Ошибка</p>
        <button type="button" onClick={() => void refetch()}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <ul>
      {data.items.map(({ question, answer }) => (
        <li key={question}>
          <h2>{question}</h2>
          <p>{answer}</p>
        </li>
      ))}
    </ul>
  );
};
