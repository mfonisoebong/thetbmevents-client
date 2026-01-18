"use client"

import axios from 'axios';
import {getBaseURL, getCookie} from "./utils";

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getCookie('token')}`,
  },
});

export default api;
