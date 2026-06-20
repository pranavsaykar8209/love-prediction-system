import { useState, useEffect } from 'react';
import AboutCalculation from './pages/AboutCalculation';
import CalculatorForm from './pages/CalculatorForm';
import ResultPage from './pages/ResultPage';

type Page = 'about' | 'calculator' | 'result';

function App() {
  const [page, setPage] = useState<Page>('about');
  const [yourName, setYourName] = useState('');
  const [crushName, setCrushName] = useState('');

  // Handle routing via hash if present or simple state updates.
  // Scroll to top on page transition for optimal user experience.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleFormSubmit = (yourNameVal: string, crushNameVal: string) => {
    setYourName(yourNameVal);
    setCrushName(crushNameVal);
    setPage('result');
  };

  const handleAnalyzeAnother = () => {
    setYourName('');
    setCrushName('');
    setPage('calculator');
  };

  if (page === 'result') {
    return (
      <ResultPage
        yourName={yourName}
        crushName={crushName}
        onAnalyzeAnother={handleAnalyzeAnother}
      />
    );
  }

  if (page === 'calculator') {
    return (
      <CalculatorForm 
        onHomeNavigate={() => setPage('about')} 
        onSubmit={handleFormSubmit}
      />
    );
  }

  return <AboutCalculation onCtaClick={() => setPage('calculator')} />;
}

export default App;



