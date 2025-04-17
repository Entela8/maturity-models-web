import { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer
} from "recharts";

interface QuestionStat {
  question: string;
  averageScore: number; // Entre 1 et 5
}

// Ex de données que tu peux remplacer dynamiquement avec un fetch :
const mockData: QuestionStat[] = [
  { question: "Communication", averageScore: 4.2 },
  { question: "Collaboration", averageScore: 3.5 },
  { question: "Leadership", averageScore: 2.8 },
  { question: "Innovation", averageScore: 4.0 },
  { question: "Planification", averageScore: 3.9 },
];

const RadarChartPage = () => {
  const [data, setData] = useState<QuestionStat[]>([]);

  useEffect(() => {
    // À remplacer par un appel API ou une logique selon ton besoin
    setData(mockData);
  }, []);

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h2 style={{ textAlign: 'center' }}>Résultats de l’évaluation</h2>
      <ResponsiveContainer>
        <RadarChart outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="question" />
          <PolarRadiusAxis domain={[1, 5]} tickCount={5} />
          <Radar
            name="Score moyen"
            dataKey="averageScore"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartPage;
