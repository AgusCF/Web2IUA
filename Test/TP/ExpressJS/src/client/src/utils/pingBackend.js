import axios from "../config/axio.js";

export const pingBackend = async () => {
  try {
    await axios.get(`${process.env.REACT_APP_API_URL}/pingFront`);
    console.log('Ping enviado al backend');
  } catch (error) {
    console.error('Error al enviar ping al backend:', error);
  }
};