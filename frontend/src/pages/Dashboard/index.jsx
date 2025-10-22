import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, clearAuth } from "../../features/auth/authSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState, useCallback } from "react";
import axios from "axios"; 
import { LogOut, Home, Users, UserPlus, Search } from "lucide-react";

const Dashboard = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    
    const [userData, setUserData] = useState(null);

    const [currentView, setCurrentView] = useState('feed'); 

    const getUser = useCallback(async (controller) => {
        try {
            const response = await axiosPrivate.get('/user', { signal: controller?.signal }); 
            setUserData(response.data);
            return response.data.id; 
        } catch (err) {
            if (!axios.isCancel(err)) { 
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
    }, [axiosPrivate, navigate, location]);


    useEffect(() => {
        const controller = new AbortController();

        getUser(controller);

        return () => {
            controller.abort();
        }
    }, [getUser])


    const handleLogout = async () => {
        try {
            await axiosPrivate.post('/logout');
            dispatch(clearAuth());
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <nav className="flex items-center gap-4">
                        <button
                            onClick={handleLogout} 
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:shadow-lg"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Panel */}
                    <aside className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                                    {userData ? userData.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                {userData ? (
                                    <>
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">{userData.name}</h2>
                                        <p className="text-sm text-gray-500 mb-4">{userData.email}</p>
                                    </>
                                ) : (
                                    <div className="animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Middle Panel */}
                    <main className="lg:col-span-6">
                        <p>The Main Panel</p>
                    </main>

                </div>
            </div>
        </div>
    )
}

export default Dashboard;
