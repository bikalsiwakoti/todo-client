import axios from 'axios';

const Axios = axios.create({
  baseURL:'http://localhost:8000/api',
//   withCredentials : true,
})

export default Axios;