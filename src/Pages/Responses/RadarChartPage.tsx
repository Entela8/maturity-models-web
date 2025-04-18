import { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { Checkbox, CircularProgress, FormControlLabel, FormGroup } from "@mui/material";
import { useParams } from "react-router-dom";
import { useStores } from "../../Stores";
import { Responses } from "../../Utils/Types/answer";
import HeaderMenu from "../../Components/HeaderMenu";

const RadarChartWithUsers = () => {
  const { modelId, sessionId } = useParams<{ modelId: string; sessionId: string }>();
  const { apiStore, userStore } = useStores();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [averageData, setAverageData] = useState<any[]>([]);
  const [responses, setResponses] = useState<Responses[]>([]);

  const getResponses = async () => {
    setLoading(true);
    try {
      const data = await apiStore.get(`response/${modelId}/${sessionId}`, {
        Authorization: `Bearer ${userStore.token}`,
      }) as Responses[];
      setResponses(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des modèles :", error);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
	  return (
		<div style={{
		  backgroundColor: 'white',
		  border: '1px solid #ccc',
		  padding: '5px',
		  borderRadius: '8px'
		}}>
		  <p style={{ color: 'black', marginBottom: '5px', fontWeight: 'bold' }}>{label}</p>
		  {payload.map((entry: any, index: number) => (
			<p key={index} style={{ color: 'black', margin: 0 }}>
			  {entry.name}: {entry.value}
			</p>
		  ))}
		</div>
	  );
	}
  
	return null;
  };
  

  useEffect(() => {
    getResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (responses.length === 0) return;

    const allQuestions = responses[0]?.answers.map(a => a.questionTitle) || [];

    const transformedData = allQuestions.map((title) => {
      const obj: any = { questionTitle: title };
      responses.forEach((user) => {
        const answer = user.answers.find(a => a.questionTitle === title);
        obj[user.userName] = answer?.score ?? 0;
      });
      return obj;
    });

    setRadarData(transformedData);
    setSelectedUsers(responses.map(u => u.userId));
  }, [responses]);

  useEffect(() => {
    if (radarData.length > 0) {
      const calculatedAverage = radarData.map(d => {
        const values = responses.map(u => d[u.userName]);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return { ...d, Moyenne: parseFloat(avg.toFixed(2)) };
      });
      setAverageData(calculatedAverage);
    }
  }, [radarData, responses]);

  const getColor = (index: number) => {
    const palette = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"];
    return palette[index % palette.length];
  };

  const handleCheckboxChange = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <>
      {loading && (
        <div className='loading'>
          <CircularProgress />
        </div>
      )}

      <HeaderMenu headerText={"Résultats par utilisateur"} />

      <div style={{ width: '100%', height: '600px' }}>
	  <FormGroup row style={{ justifyContent: "center", marginBottom: "1rem" }}>
			{responses.map((user, idx) => (
				<FormControlLabel
				key={user.userId}
				control={
					<Checkbox
					checked={selectedUsers.includes(user.userId)}
					onChange={() => handleCheckboxChange(user.userId)}
					/>
				}
				label={
					<span style={{ color: getColor(idx), fontWeight: "bold" }}>
					{user.userName}
					</span>
				}
				/>
			))}

			{/* Moyenne toujours cochée, couleur jaune */}
			<FormControlLabel
				control={<Checkbox defaultChecked disabled />}
				label={<span style={{ color: "#FFFF00", fontWeight: "bold" }}>Moyenne</span>}
			/>
		</FormGroup>


        <ResponsiveContainer>
          <RadarChart data={averageData} outerRadius="80%">
            <PolarGrid />
            <PolarAngleAxis dataKey="questionTitle" />
            <PolarRadiusAxis domain={[1, 5]} />
            <Tooltip content={<CustomTooltip />} />

            {responses.map((user, index) =>
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

            <Radar
              name="Moyenne"
              dataKey="Moyenne"
              stroke="#FFFF00"
              fill="#FFFF00"
              fillOpacity={0.1}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default RadarChartWithUsers;
