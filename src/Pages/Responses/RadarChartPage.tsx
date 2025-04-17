import { useEffect, useState } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Checkbox, CircularProgress, FormControlLabel, FormGroup } from "@mui/material";
import { useParams } from "react-router-dom";
import { useStores } from "../../Stores";
import { Responses } from "../../Utils/Types/answer";
import HeaderMenu from "../../Components/HeaderMenu";

const RadarChartWithUsers = () => {
	const { modelId, sessionId } = useParams<{ modelId: string; sessionId: string }>();
	const { apiStore, userStore } = useStores()
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [radarData, setRadarData] = useState<any[]>([]);
	const [questions, setQuestions] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [averageData, setAverageData] = useState<any[]>([]);
	const [responses, setResponses] = useState<Responses[]>([]);

	const getResponses = async () => {
		setLoading(true);
		try {
			const data = await apiStore.get(`response/${modelId}/${sessionId}`, {
				Authorization: `Bearer ${userStore.token}`,
			}) as Responses[];
			setResponses(data)
			console.dir(responses);
		} catch (error) {
			console.error("Erreur lors de la récupération des modèles :", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		getResponses()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const allQuestions = responses[0]?.answers.map(a => a.question) || [];
		setQuestions(allQuestions);

		const transformedData: any[] = allQuestions.map((q) => {
			const obj: any = { question: q };
			responses.forEach((u) => {
			const answer = u.answers.find(a => a.question === q);
			obj[u.userName] = answer?.score ?? 0;
			});
			return obj;
		});

		setRadarData(transformedData);
		setSelectedUsers(responses.map(u => u.userId)); // Tout coché par défaut
	}, []);

	useEffect(() => {
	// Calcul de la moyenne une seule fois
		if (radarData.length > 0) {
			const calculatedAverage = radarData.map(d => {
			const values = responses.map(u => d[u.userName]);
			const avg = values.reduce((a, b) => a + b, 0) / values.length;
			return { ...d, Moyenne: parseFloat(avg.toFixed(2)) };
			});
			setAverageData(calculatedAverage);
		}
	}, [radarData]);

	const getColor = (index: number) => {
		const palette = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"];
		return palette[index % palette.length];
	};

	const renderCustomLegend = () => (
	<ul style={{ listStyle: "none", padding: 0, textAlign: "center" }}>
		{responses.map((user, index) => (
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
		<>
		{loading && 
		<div className='loading'>
			<CircularProgress />
		</div>
		}

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
					label={user.userName}
				/>
			))}
			<FormControlLabel
				control={<Checkbox defaultChecked disabled />}
				label="Moyenne"
			/>
			</FormGroup>

			<ResponsiveContainer>
				{/* Utilisation de averageData */}
				<RadarChart data={averageData} outerRadius="80%">
					<PolarGrid />
					<PolarAngleAxis dataKey="question" />
					<PolarRadiusAxis domain={[1, 5]} />
					<Tooltip />
					{/* Custom legend with colors */}
					<Legend content={renderCustomLegend} /> 

					{/* Radars par utilisateur sélectionné */}
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

					{/* Radar pour la moyenne (toujours affichée) */}
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
