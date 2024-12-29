// src/app/components/FamilyScores.tsx
type FamilyScoresProps = {
    scores: {
      father: number;
      mother: number;
      bigsis: number;
      littlesis: number;
    };
  };
  
  export default function FamilyScores({ scores }: FamilyScoresProps) {
    const scoreItems = [
      { label: 'パパ', score: scores.father },
      { label: 'ママ', score: scores.mother },
      { label: '姉(14)', score: scores.bigsis },
      { label: '妹(11)', score: scores.littlesis },
    ];
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scoreItems.map(({ label, score }) => (
          <div 
            key={label} 
            className="text-center p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="font-medium text-gray-600">{label}</div>
            <div className="text-2xl font-bold text-gray-900">{score}</div>
          </div>
        ))}
      </div>
    );
  }