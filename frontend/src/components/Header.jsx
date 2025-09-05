import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, Phone, Mail } from 'lucide-react';
import { mockData } from '../data/mock';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${mockData.company.whatsapp}`, '_blank');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">{mockData.company.name}</h1>
              <p className="text-xs text-green-600">Engenharia Diagnóstica</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Início
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Sobre
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Serviços
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Contato
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={openWhatsApp}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Solicitar Orçamento
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-8">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-left text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Início
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-left text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Sobre
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-left text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Serviços
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
          className="text-left text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                >
                  Contato
                </button>
                
                <div className="pt-6 space-y-3">
                  <Button 
                    onClick={openWhatsApp}
                    variant="outline" 
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button 
                    onClick={() => scrollToSection('contact')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Solicitar Orçamento
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};