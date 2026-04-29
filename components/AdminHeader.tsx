import React from 'react';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-gray-800 p-4 shadow-lg border-b border-gray-700 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl font-bold text-white">Painel do Administrador</h1>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        Sair
      </button>
    </header>
  );
};

export default AdminHeader;
