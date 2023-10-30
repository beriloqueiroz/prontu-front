import axios from 'axios';

export const api = axios.create({
  baseURL: `/api`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const apiBack = axios.create({
  baseURL: `http://localhost:5100/api`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const apiAuth = axios.create({
  baseURL: `http://localhost:5000/`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});