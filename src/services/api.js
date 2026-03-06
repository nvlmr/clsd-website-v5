const BASE_URL = "http://localhost/clsd-backend/public";

export const fetchResearchTeam = async () => {

  const response = await fetch(`${BASE_URL}/get_research_team.php`);

  if (!response.ok) {
    throw new Error("Failed to fetch research team");
  }

  return await response.json();
};