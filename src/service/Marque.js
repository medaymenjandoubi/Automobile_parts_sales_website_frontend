import axios from "axios";

export const getAllMarques = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}getAllMarques`, {
        withCredentials: true,
      });

      return response
    } catch (error) {
      console.log(error);
    }
  };
