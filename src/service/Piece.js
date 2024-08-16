import axios from "axios";

export const getAllPiece = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}getAllPiece`, {
        withCredentials: true,
      });

      return response
    } catch (error) {
      console.log(error);
    }
  };
