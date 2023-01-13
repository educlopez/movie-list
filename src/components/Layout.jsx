import { motion } from 'framer-motion';
import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import bgRayLight from '@/images/bg-ray-light.png';
import bgRayDark from '@/images/bg-ray-dark.png';

export function Layout({ children, sections = [] }) {
  return (
    <>
      <div className="relative overflow-hidden">
        <Image
          src={bgRayLight}
          alt=""
          className="absolute top-0 left-1/2 -ml-[39rem] w-[113.125rem] max-w-none dark:hidden"
        />
        <Image
          src={bgRayDark}
          alt=""
          className="absolute hidden top-0 left-1/2 -ml-[39rem] w-[113.125rem] max-w-none dark:block"
        />
        <motion.header layoutScroll>
          <Header />
        </motion.header>
        <div className="relative max-w-2xl px-4 pb-16 mx-auto space-y-10 pt-14 sm:px-6 lg:px-8 lg:max-w-5xl">
          <main className="py-16">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
