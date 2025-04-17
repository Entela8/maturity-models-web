import { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

// Exemple de données
const mockResponses = [
  {
    userId: 1,
    userName: "Alice",
    answers: [
      { question: "Communication", score: 4 },
      { question: "Collaboration", score: 5 },
      { question: "Leadership", score: 3 },
      { question: "Innovation", score: 4 },
      { question: "Planification", score: 2 },
    ]
  },
  {
    userId: 2,
    userName: "Bob",
    answers: [
      { question: "Communication", score: 3 },
      { question: "Collaboration", score: 4 },
      { question: "Leadership", score: 4 },
      { question: "Innovation", score: 5 },
      { question: "Planification", score: 3 },
    ]
  },
  {
    userId: 4,
    userName: "Delta",
    answers: [
      { question: "Communication", score: 5 },
      { question: "Collaboration", score: 5 },
      { question: "Leadership", score: 5 },
      { question: "Innovation", score: 5 },
      { question: "Planification", score: 5 },
    ]
  },
  {
    userId: 3,
    userName: "Charlie",
    answers: [
      { question: "Communication", score: 5 },
      { question: "Collaboration", score: 3 },
      { question: "Leadership", score: 2 },
      { question: "Innovation", score: 3 },
      { question: "Planification", score: 4 },
    ]
  }
];

const RadarChartWithUsers = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [averageData, setAverageData] = useState<any[]>([]); // Nouvel état pour la moyenne

  useEffect(() => {
    const allQuestions = mockResponses[0]?.answers.map(a => a.question) || [];
    setQuestions(allQuestions);

    const transformedData: any[] = allQuestions.map((q) => {
      const obj: any = { question: q };
      mockResponses.forEach((u) => {
        const answer = u.answers.find(a => a.question === q);
        obj[u.userName] = answer?.score ?? 0;
      });
      return obj;
    });

    setRadarData(transformedData);
    setSelectedUsers(mockResponses.map(u => u.userId)); // Tout coché par défaut
  }, []);

  useEffect(() => {
    // Calcul de la moyenne une seule fois
    if (radarData.length > 0) {
      const calculatedAverage = radarData.map(d => {
        const values = mockResponses.map(u => d[u.userName]);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return { ...d, Moyenne: parseFloat(avg.toFixed(2)) };
      });
      setAverageData(calculatedAverage);
    }
  }, [radarData]); // Dépend uniquement de radarData

  const getColor = (index: number) => {
    const palette = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"]; // Updated color palette
    return palette[index % palette.length];
  };

  const renderCustomLegend = () => (
    <ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
      {mockResponses.map((user, index) => (
        <li key={user.userId} style={{ color: getColor(index), fontWeight: "bold" }}>
          {user.userName}
        </li>
      ))}
      <li style={{ color: "#FFFF00", fontWeight: "bold" }}>Moyenne</li>
    </ul>
  );

  const handleCheckboxChange = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <h2 style={{ textAlign: 'center' }}>Résultats par utilisateur</h2>

      <FormGroup row style={{ justifyContent: "center", marginBottom: "1rem" }}>
        {mockResponses.map((user, idx) => (
          <FormControlLabel
            key={user.userId}
            control={
              <Checkbox
                checked={selectedUsers.includes(user.userId)}
                onChange={() => handleCheckboxChange(user.userId)}
              />
            }
            label={user.userName}
          />
        ))}
        <FormControlLabel
          control={<Checkbox defaultChecked disabled />}
          label="Moyenne"
        />
      </FormGroup>

      <ResponsiveContainer>
        <RadarChart data={averageData} outerRadius="80%"> {/* Utilisation de averageData */}
          <PolarGrid />
          <PolarAngleAxis dataKey="question" />
          <PolarRadiusAxis domain={[1, 5]} />
          <Tooltip />
          <Legend content={renderCustomLegend} /> {/* Custom legend with colors */}

          {/* Radars par utilisateur sélectionné */}
          {mockResponses.map((user, index) =>
            selectedUsers.includes(user.userId) && (
              <Radar
                key={user.userId}
                name={user.userName}
                dataKey={user.userName}
                stroke={getColor(index)}
                fill={getColor(index)}
                fillOpacity={0.2}
              />
            )
          )}

          {/* Radar pour la moyenne (toujours affichée) */}
          <Radar
            name="Moyenne"
            dataKey="Moyenne"
            stroke="#FFFF00" // Yellow color for "Moyenne"
            fill="#FFFF00"   // Yellow color for "Moyenne"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartWithUsers;
