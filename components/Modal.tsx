
import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    children: React.ReactNode;
    hideCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, hideCloseButton = false }) => {
    
    // Bloquear scroll do body quando modal estiver aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all scale-100">
                
                {/* Header */}
                {(title || !hideCloseButton) && (
                    <div className="flex justify-between items-center p-6 border-b border-gray-700">
                        {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
                        {!hideCloseButton && onClose && (
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                )}

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
