import React, { useEffect } from 'react';
import { BASE_TITLE } from 'utils/config';

interface PageProps {
  title: string;
  children: React.ReactNode;
}

function Page({ title, children }: PageProps) {
  useEffect(() => {
    document.title = `${title} | ${BASE_TITLE}`;
  }, [title]);

  return children as React.ReactElement;
}

export default Page;
