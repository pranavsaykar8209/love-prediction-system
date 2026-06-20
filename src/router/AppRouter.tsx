import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AboutCalculation from '../pages/AboutCalculation/AboutCalculation';
import CalculatorForm from '../pages/CalculatorForm/CalculatorForm';
import ResultPage from '../pages/ResultPage/ResultPage';

const AboutWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.location.hash === '#how-it-works') {
        setTimeout(() => {
          const el = document.getElementById('how-it-works');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };
    
    handleScroll();
    window.addEventListener('hashchange', handleScroll);
    return () => window.removeEventListener('hashchange', handleScroll);
  }, []);

  return <AboutCalculation onCtaClick={() => navigate('/calculator')} />;
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
    sessionStorage.removeItem('yourName');
    sessionStorage.removeItem('crushName');
    navigate('/calculator');
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <AboutWrapper />,
  },
  {
    path: '/calculator',
    element: <CalculatorWrapper />,
  },
  {
    path: '/result',
    element: <ResultWrapper />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
