
import React from 'react';
import { User } from '../../types';
import { MOCK_USERS } from '../../constants';
import { ArrowLeft, Check, Plus, UserPlus } from 'lucide-react';

interface SwitchAccountPageProps {
  currentUser: User | null;
  onSelect: (user: User) => void;
  onBack: () => void;
}

export const SwitchAccountPage: React.FC<SwitchAccountPageProps> = React.memo(({ currentUser, onSelect, onBack }) => {
  return (
    <div className="min-h-full bg-[var(--app-bg,var(--app-bg))] text-[var(--text-primary,var(--text-primary))] animate-fade-in flex flex-col">
      <header className="p-6 bg-primary text-white flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold font-montserrat tracking-tight">Accounts</h1>
      </header>

      <div className="p-6 flex-1 space-y-4">
        <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] mb-4">Switch Persona</p>
        
        <div className="space-y-3">
          {MOCK_USERS.map((user) => {
            const isCurrent = currentUser?.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => onSelect(user)}
                className={`w-full p-4 rounded-3xl border transition-all flex items-center gap-4 ${
                  isCurrent 
                    ? 'bg-white border-secondary shadow-lg scale-[1.02]' 
                    : 'bg-white border-black/5 hover:border-primary/20 shadow-sm active:scale-95'
                }`}
              >
                <div className="relative">
                  <img src={user.avatar} loading="lazy" className="w-14 h-14 rounded-2xl border-2 border-[var(--app-bg,var(--app-bg))] shadow-inner" alt="" />
                  {isCurrent && (
                    <div className="absolute -bottom-1 -right-1 bg-secondary text-white p-1 rounded-full border-2 border-white shadow-md">
                      <Check size={12} />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-primary">{user.displayName}</h3>
                  <p className="text-xs text-secondary font-bold">@{user.username}</p>
                </div>
                {!isCurrent && (
                  <div className="text-primary/20 group-hover:text-primary transition-colors">
                    <ArrowLeft className="rotate-180" size={18} />
                  </div>
                )}
              </button>
            );
          })}

          <button className="w-full p-6 rounded-3xl border-2 border-dashed border-primary/10 flex flex-col items-center justify-center gap-3 bg-primary/5 hover:bg-primary/10 transition-all text-primary/40 active:scale-95">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              <Plus size={24} className="text-secondary" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Add New Persona</span>
          </button>
        </div>
      </div>

      <div className="p-8 text-center">
        <p className="text-[9px] text-primary/30 font-bold uppercase tracking-[0.4em] mb-6">Security Layer Active</p>
        <div className="flex items-center justify-center gap-2 text-primary/20">
          <UserPlus size={14} />
          <span className="text-[10px] font-bold">Manage multiple identities securely.</span>
        </div>
      </div>
    </div>
  );
});
