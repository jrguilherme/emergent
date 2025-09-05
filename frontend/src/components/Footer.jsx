import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Phone, 
  Mail, 
  MapPin,
  Shield,
  Award,
  FileText
} from 'lucide-react';
import { mockData } from '../data/mock';

export const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${mockData.company.whatsapp}`, '_blank');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl">{mockData.company.name}</h3>
                  <p className="text-green-400">Engenharia Diagnóstica</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                {mockData.company.tagline}. Especialistas em perícias judiciais, 
                avaliações e regularização de imóveis em todo o Paraná.
              </p>

              <div className="flex flex-wrap gap-4">
                <Badge className="bg-green-900 text-green-300 hover:bg-green-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Rigor Técnico
                </Badge>
                <Badge className="bg-green-900 text-green-300 hover:bg-green-800">
                  <Award className="w-3 h-3 mr-1" />
                  Normas ABNT
                </Badge>
                <Badge className="bg-green-900 text-green-300 hover:bg-green-800">
                  <FileText className="w-3 h-3 mr-1" />
                  Transparência
                </Badge>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg">Navegação</h4>
              <nav className="space-y-3">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="block text-gray-300 hover:text-green-400 transition-colors"
                >
                  Início
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block text-gray-300 hover:text-green-400 transition-colors"
                >
                  Sobre
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="block text-gray-300 hover:text-green-400 transition-colors"
                >
                  Serviços
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block text-gray-300 hover:text-green-400 transition-colors"
                >
                  Contato
                </button>
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h4 className="font-bold text-lg">Contato</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">{mockData.company.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">{mockData.company.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">{mockData.company.address}</span>
                </div>
              </div>

              <Button 
                onClick={openWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {mockData.company.name}. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};