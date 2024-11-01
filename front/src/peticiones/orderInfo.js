import axios from "axios";
import { URL } from "../App";

export const orderInfo = async (setInfoWeb) => {
  try {
    const response = await axios.get(`${URL}/order-infoweb`);
    if (response.status === 200) {
      setInfoWeb(response.data);
    } else if (response.status === 205) {
      setUser();
    }
  } catch (error) {
    console.log(error);
  }
};
