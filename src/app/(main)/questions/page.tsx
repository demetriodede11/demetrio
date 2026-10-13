import { cache, Suspense } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { io } from 'next/cache';

import { getFaqList, FaqList } from '$modules/faq';

const getFaqData = cache(async () => {
  await io();
  const queryClient = new QueryClient();

  const data = await queryClient.query(getFaqList).catch(() => undefined);

  return { queryClient, data };
});

export const generateMetadata = async () => {
  const { data } = await getFaqData();

  return {
    title: data?.meta?.title ?? 'Частые вопросы',
    description: data?.meta?.metaDesc ?? 'Частые вопросы и ответы',
    keywords: data?.meta?.metaKeys ?? '',
  };
};

const QuestionsContent = async () => {
  const { queryClient } = await getFaqData();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FaqList />
    </HydrationBoundary>
  );
};

const Questions = () => (
  <Suspense fallback={<p role="status">Загрузка</p>}>
    <QuestionsContent />
  </Suspense>
);

export default Questions;
