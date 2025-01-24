// src/components/AnimatedContainer.tsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeInVariants } from '@/app/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedContainer({
  children,
  delay = 0,
  className
}: AnimatedContainerProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}