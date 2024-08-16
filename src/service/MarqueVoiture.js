import axios from "axios";

export const getAllMarquesVoiture = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}getAllMarqueVoiture`, {
        withCredentials: true,
      });

      return response
    } catch (error) {
      console.log(error);
    }
  };
