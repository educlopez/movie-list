import { useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import '@/styles/tailwind.css';
import 'focus-visible';

function usePrevious(value) {
  let ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default function App({ Component, pageProps, router }) {
  let previousPathname = usePrevious(router.pathname);

  return (
    <>
      <div className="relative">
        <main>
          <Layout {...pageProps}>
            <Component previousPathname={previousPathname} {...pageProps} />
          </Layout>
        </main>
      </div>
    </>
  );
}
