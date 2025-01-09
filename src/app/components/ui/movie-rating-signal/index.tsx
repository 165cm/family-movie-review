// src/components/ui/movie-rating-signal/index.tsx
interface MovieRatingSignalProps {
  score: number;
}

export const MovieRatingSignal = ({ score }: MovieRatingSignalProps) => {
  const getSignalColor = (score: number) => {
    const normalizedScore = score / 2; // 10点満点から5点満点に変換
    if (normalizedScore >= 4) return 'bg-green-500';
    if (normalizedScore >= 2.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getDangerLevel = (score: number) => {
    const normalizedScore = score / 2;
    if (normalizedScore >= 4) return '安全';
    if (normalizedScore >= 2.5) return '要注意';
    return '視聴注意';
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-start gap-2">
        <span className="text-lg font-semibold text-gray-700">危険度</span>
        <span className="text-2xl font-bold">{getDangerLevel(score)}</span>
      </div>
      <div className={`w-20 h-20 rounded-full ${getSignalColor(score)} flex items-center justify-center shadow-lg transition-all hover:scale-105`}>
        <span className="text-3xl font-bold text-white">{(score / 2).toFixed(1)}</span>
      </div>
    </div>
  );
};