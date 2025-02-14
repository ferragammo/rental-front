import {Route, Routes} from 'react-router-dom';
import Home from './Page/Home';
import {useEffect} from "react";
import Cookies from "js-cookie";

function App() {

    async function refreshToken() {
        const response = await fetch('https://maple-ai-dev.onrender.com/v1/admin/services/login', {
            method: 'POST',
            body: JSON.stringify({
                "email": "maksim.shymanouski@clipboardhealth.com",
                "password": "123456789"
            }),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
        });

        if (response.ok) {
            const data = await response.json();
            Cookies.set('accessToken', data.text);
            return data.text;
        } else {
            console.error('Refresh token failed');
        }
    }

    const useTokenRefresh = () => {
        refreshToken()
        useEffect(() => {
            const intervalId = setInterval(async () => {
                await refreshToken()
            }, 50 * 60 * 1000);
            return () => clearInterval(intervalId);
        }, []);
    };

    useTokenRefresh();
  return (

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
 
  );
}

export default App;
