import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import ProfileView from './ProfileView';

const ConversationDetails = ({ conversation, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState('members');

  if (!conversation) return null;

  // ... (Tus datos mock se mantienen igual) ...
  const sharedMedia = [ /* ... */ ];
  const tabs = [ /* ... */ ];
  const formatDate = (ts) => new Date(ts)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    // CAMBIO 1: Añadido rounded-r-[2.5rem] y overflow-hidden para encajar en el Dashboard
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full rounded-r-[2.5rem] overflow-hidden">
      
      {/* CAMBIO 2: Ajustado el padding (pl-6 py-5 pr-10) para alejar el botón X de la curva */}
      <div className="pl-6 py-5 pr-10 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Details</h3>
          {/* El botón ahora tiene espacio seguro gracias al pr-10 del padre */}
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* ... Resto del componente igual ... */}
        <div className="text-center">
        {/* ... */}
        </div>
        
        {/* ... */}
      </div>
      
      {/* ... Resto del componente (Tabs, Content, Settings) se mantiene igual ... */}
      <div className="border-b border-slate-800">
        <div className="flex">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                activeTab === tab?.id
                  ? 'text-indigo-400 border-indigo-400' 
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* ... contenido de tabs ... */}
          {activeTab === 'members' && (
             <div className="p-4 space-y-3">
               {conversation?.participants?.map((participant) => (
                 <ProfileView
                   key={participant?.id}
                   user={participant}
                   showFullName={true}
                   showStatus={true}
                   showLastSeen={true}
                   showRole={true}
                   size="default"
                   currentUser={currentUser}
                   className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200"
                 />
               ))}
               {/* ... */}
             </div>
          )}
          {/* ... resto de tabs ... */}
          {/* SOLO PARA REFERENCIA, MANTÉN TU CÓDIGO DE TABS AQUÍ */}
          {activeTab === 'media' && <div className="p-4">...</div>}
          {activeTab === 'files' && <div className="p-4">...</div>}
      </div>
      
      {/* Settings */}
      <div className="border-t border-slate-800 p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800">
          <Icon name="Bell" size={16} className="mr-3" />
          Notifications
        </Button>
        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800">
          <Icon name="Archive" size={16} className="mr-3" />
          Archive Chat
        </Button>
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20">
          <Icon name="Trash2" size={16} className="mr-3" />
          Delete Chat
        </Button>
      </div>
    </div>
  );
};

export default ConversationDetails;