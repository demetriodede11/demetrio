'use client';

import { ReactQueryProvider } from './ReactQueryProvider';

type TProps = React.PropsWithChildren;

export const AppProvider = ({ children }: TProps) => (
  <ReactQueryProvider>{children}</ReactQueryProvider>
);
