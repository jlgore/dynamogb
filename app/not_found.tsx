//'use client';
// app/_not-found.tsx
export const runtime = "edge";
import { GetStaticProps, NextPage } from 'next';

interface NotFoundProps {
  message: string;
}

const NotFound: NextPage<NotFoundProps> = ({ message }) => {
  return <h1>{message}</h1>;
};

export const getStaticProps: GetStaticProps<NotFoundProps> = async () => {
  const res = await fetch('/api/notFound');
  const data = await res.json();

  return {
    props: {
      message: data.message,
    },
  };
};

export default NotFound;