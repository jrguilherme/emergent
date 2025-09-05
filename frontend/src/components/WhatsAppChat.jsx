import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { MessageCircle, X, Send } from 'lucide-react';
import { mockData } from '../data/mock';

export const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show chat button after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const openWhatsApp = (message = '') => {
    const defaultMessage = "Olá! Gostaria de saber mais sobre os serviços da Mensura Maat.";
    const text = encodeURIComponent(message || defaultMessage);
    window.open(`https://wa.me/${mockData.company.whatsapp}?text=${text}`, '_blank');
    setIsOpen(false);
  };

  const quickMessages = [
    "Gostaria de solicitar um orçamento",
    "Preciso de uma perícia judicial",
    "Quero avaliar meu imóvel",
    "Tenho dúvidas sobre regularização"
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-green-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold">Mensura Maat</h4>
                  <p className="text-xs text-green-100">Online agora</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                Olá! Como podemos ajudar você hoje?
              </p>
            </div>

            {/* Quick Messages */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Mensagens rápidas:</p>
              {quickMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => openWhatsApp(message)}
                  className="w-full text-left p-3 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                >
                  {message}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => openWhatsApp()}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Iniciar Conversa
            </Button>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>

      {/* Notification Pulse */}
      {!isOpen && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      )}
    </div>
  );
};