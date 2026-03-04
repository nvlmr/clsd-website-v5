const API_URL = "http://localhost/lspu-clsd/backend/api/";

export const getUsers = async () => {
  const response = await fetch(API_URL + "Users.php");
  return response.json();
};