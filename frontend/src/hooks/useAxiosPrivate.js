import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector, useDispatch } from "react-redux"; 
import { selectCurrentToken, clearAuth } from "../features/auth/authSlice"; 

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch(); 

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                } 
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                const status = error?.response?.status;
                                
                if (status === 401 && !prevRequest?.sent) {
                    
                    console.warn("[AxiosPrivate:Response] 401 Unauthorized detected. Attempting token refresh.");                     
                    prevRequest.sent = true; 
                    try {
                        const newAccessToken = await refresh();
                        
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest); 
                    } catch (refreshError) {
                        dispatch(clearAuth());
                        
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [token, refresh, dispatch]) 

    return axiosPrivate;
}

export default useAxiosPrivate;
