
export default interface Team 
{
    "id": string | undefined,
    "name": string,
}

export interface ActiveSessionTeam {
    id: number;
    modelId: number;
    teamId: number;
    teamName: string;
    active: boolean;
    date: string;
}  