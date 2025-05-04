import { useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function useAxios() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currAccess = useSelector((state) => state.auth.accessToken);
  const currRefresh = useSelector((state) => state.auth.refreshToken);

  const baseInstance = api;

  const clearStorageAndNavigate = (navigate) => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    if (currRefresh === null){
      return
    }
    const refreshToken = async () => {
      const refresh_token = currRefresh;
      if (!refresh_token) {
        clearStorageAndNavigate(navigate);
      }
      console.log('refreshing token');
      console.log('refresh token is', refresh_token);
      const { data } = await baseInstance.post("api/token/refresh/", { refresh: refresh_token });
      dispatch(setTokens({ accessToken: data.access, refreshToken: refresh_token }));
      return data.access_token;
    };

    const requestIntercept = baseInstance.interceptors.request.use(
      (config) => {
        if(config.url.includes('refresh')) return config;
        if (!config.headers["Authorization"] && currAccess) {
          config.headers["Authorization"] = `Bearer ${currAccess}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = baseInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if(prevRequest.url.includes('refresh')) return Promise.reject(error);
        if (error?.response?.status === 401 && !prevRequest.sent) {
          const new_access = await refreshToken();
          prevRequest.sent = true;
          prevRequest.headers = { ...prevRequest.headers, "Authorization": `Bearer ${new_access}`}
          return baseInstance(prevRequest);
        };
        return Promise.reject(error);
      });

    return () => {
      baseInstance.interceptors.request.eject(requestIntercept);
      baseInstance.interceptors.response.eject(responseIntercept);
    };

  }, [currAccess, currRefresh, baseInstance, dispatch, navigate]); // Remove refreshToken from the dependency array

  return baseInstance;
};