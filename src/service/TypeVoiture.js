import axios from "axios";

export const getAllTypeVoiture = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}getAllTypeVoiture`, {
        withCredentials: true,
      });

      return response
    } catch (error) {
      console.log(error);
    }
  };
