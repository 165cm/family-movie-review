// src/app/components/MovieDetailLayout.tsx
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from "@/app/components/ui/skeleton";
import { MovieDetailLayoutProps } from '@/types/movie';
import AnimatedContainer from './AnimatedContainer';

const YouTubePlayer = dynamic(() => import('./YouTubePlayer'), {
    loading: () => (
      <Skeleton className="aspect-video w-full" />
    ),
    ssr: false,
  });

export default function MovieDetailLayout({ movie }: MovieDetailLayoutProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // YouTubeプレーヤーの事前読み込み
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        import('./YouTubePlayer');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <AnimatedContainer>
        <h1 className="text-3xl font-bold mb-6">{movie.name}</h1>
      </AnimatedContainer>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* 左カラム：情報セクション */}
        <div className="space-y-6">
          <AnimatedContainer delay={0.2}>
            <section className="bg-white rounded-lg p-6 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="text-xl font-semibold mb-3">あらすじ</h2>
              <p className="text-gray-700 leading-relaxed">{movie.synopsis}</p>
            </section>
          </AnimatedContainer>
          
          <AnimatedContainer delay={0.4}>
            <section className="bg-white rounded-lg p-6 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="text-xl font-semibold mb-4">家族の評価</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(movie.familyScores).map(([member, score], index) => (
                  <motion.div
                    key={member}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="text-center"
                  >
                    <div className="text-lg font-medium mb-1">
                      {getMemberName(member)}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {score}<span className="text-sm text-gray-500">/10</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </AnimatedContainer>
        </div>

        {/* 右カラム：予告編 */}
        <div className="md:sticky md:top-6" ref={ref}>
          <AnimatedContainer delay={0.6}>
            <div className="bg-white rounded-lg p-6 shadow-sm transition-shadow hover:shadow-md">
              <h2 className="text-xl font-semibold mb-4">予告編</h2>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isVisible ? 'player' : 'placeholder'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                  onMouseEnter={() => setIsVisible(true)}
                  onClick={() => setIsVisible(true)}
                >
                    {movie.youtubeId && (
                        <YouTubePlayer url={movie.youtubeId} />
                    )}
                    {!movie.youtubeId && (
                      <div className="aspect-video bg-gray-100 rounded flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                        <span className="text-gray-500">クリックで予告編を表示</span>
                      </div>
                    )}
                </motion.div>
              </AnimatePresence>
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
}

function getMemberName(member: string): string {
  const names = {
    father: '父',
    mother: '母',
    sister: '姉',
    brother: '弟'
  };
  return names[member as keyof typeof names] || member;
}