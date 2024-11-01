import axios from "axios";
import { URL } from "../App";
import { notifyErroneo } from "../alerts/Alerts";

export const changeUser = async (setUser) => {
  try {
    const token = await JSON.parse(localStorage.getItem("TokenLogin"));
    if (!token) {
      setUser(null);
      return;
    }

    const response = await axios.get(`${URL}/perfil`, {
      headers: {
        authorization: `Barer ${token}`,
      },
    });
    if (response.status === 200) {
      setUser(response.data);
    } else if (response.status === 205) {
      setUser();
      localStorage.removeItem("TokenLogin");
      window.location.href = "/";
    } else {
      setUser();
      notifyErroneo("La cuenta no es Admin");
      localStorage.removeItem("TokenLogin");
      // window.location.href = "/";
    }
  } catch (error) {
    setUser();
    localStorage.removeItem("TokenLogin");
    console.log(error);
  }
};

export const findUsers = async (setUsers) => {
  try {
    const response = await axios.get(`${URL}/find-users`);
    if (response.status === 200) {
      setUsers(response.data);
    } else {
      setUsers();
    }
  } catch (error) {
    console.error(error);
  }
};
