import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <SettingsIcon size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
      <p className="text-gray-600">Configure your trading preferences and API connections</p>
    </div>
  );
};

export default Settings;