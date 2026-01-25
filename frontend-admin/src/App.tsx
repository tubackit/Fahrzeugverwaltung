import { useState } from 'react';
import EnterpriseLayout from './components/EnterpriseLayout';
import EnterpriseDashboard from './components/EnterpriseDashboard';

type ActiveView = 'stammdaten' | 'versicherung' | 'unterlagen' | 'reifen';

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('stammdaten');

  return (
    <EnterpriseLayout
      activeView={activeView}
      onStammdatenClick={() => setActiveView('stammdaten')}
      onVersicherungClick={() => setActiveView('versicherung')}
      onUnterlagenClick={() => setActiveView('unterlagen')}
      onReifenClick={() => setActiveView('reifen')}
    >
      <EnterpriseDashboard activeView={activeView} />
    </EnterpriseLayout>
  );
}

export default App;
