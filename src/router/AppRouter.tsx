import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate, useLocation, Outlet, ScrollRestoration } from 'react-router-dom';
import AboutCalculation from '../pages/AboutCalculation/AboutCalculation';
import CalculatorForm from '../pages/CalculatorForm/CalculatorForm';
import ResultPage from '../pages/ResultPage/ResultPage';
import HistoryPage from '../pages/HistoryPage/HistoryPage';

const RootLayout: React.FC = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

const AboutWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.location.hash === '#how-it-works') {
        setTimeout(() => {
          const el = document.getElementById('how-it-works');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            // Clean up the URL hash so the browser doesn't lock scroll to it
            setTimeout(() => {
              window.history.replaceState(null, '', window.location.pathname);
            }, 800);
          }
        }, 100);
      }
    };
    
    handleScroll();
    window.addEventListener('hashchange', handleScroll);
    return () => window.removeEventListener('hashchange', handleScroll);
  }, []);

  return (
    <AboutCalculation 
      onCtaClick={() => navigate('/calculator')} 
    />
  );
};

const CalculatorWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (yourName: string, crushName: string) => {
    sessionStorage.setItem('yourName', yourName);
    sessionStorage.setItem('crushName', crushName);
    navigate('/result', { state: { yourName, crushName } });
  };
  
  return (
    <CalculatorForm 
      onHomeNavigate={() => navigate('/')} 
      onSubmit={handleSubmit}
    />
  );
};

const ResultWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as { yourName?: string; crushName?: string } | null;
  const yourName = state?.yourName || sessionStorage.getItem('yourName') || '';
  const crushName = state?.crushName || sessionStorage.getItem('crushName') || '';
  
  // If no names are present, redirect to calculator
  if (!yourName && !crushName) {
    return <Navigate to="/calculator" replace />;
  }
  
  const handleAnalyzeAnother = () => {
    // Keep names in sessionStorage and pass them as navigation state
    // so CalculatorForm can pre-fill the last-used values
    navigate('/calculator', { state: { yourName, crushName } });
  };
  
  return (
    <ResultPage
      yourName={yourName}
      crushName={crushName}
      onAnalyzeAnother={handleAnalyzeAnother}
      onHomeNavigate={() => navigate('/')}
    />
  );
};

const HistoryWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <HistoryPage
      onHomeNavigate={() => navigate('/')}
      onCalculateNavigate={() => navigate('/calculator')}
    />
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <AboutWrapper />,
      },
      {
        path: 'calculator',
        element: <CalculatorWrapper />,
      },
      {
        path: 'result',
        element: <ResultWrapper />,
      },
      {
        path: 'history',
        element: <HistoryWrapper />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
