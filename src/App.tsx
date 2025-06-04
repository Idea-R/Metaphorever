import React from 'react';
import { MetaphorProvider } from './context/MetaphorContext';
import Layout from './components/Layout';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ToneSelector from './components/ToneSelector';
import GenerateButton from './components/GenerateButton';
import CurrentMetaphor from './components/CurrentMetaphor';
import Tabs from './components/Tabs';
import ShareHandler from './components/ShareHandler';
import FloatingButton from './components/FloatingButton';

function App() {
  return (
    <MetaphorProvider>
      <Layout>
        <ShareHandler />
        <Header />
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <InputSection />
          <ToneSelector className="mb-6" />
          <GenerateButton />
        </div>
        
        <CurrentMetaphor />
        
        <Tabs />
        <FloatingButton />
      </Layout>
    </MetaphorProvider>
  );
}

export default App;