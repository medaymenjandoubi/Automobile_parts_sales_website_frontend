import axios from "axios";

export const getAllTypePiece = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}getAllTypePiece`, {
        withCredentials: true,
      });

      return response
    } catch (error) {
      console.log(error);
    }
  };
