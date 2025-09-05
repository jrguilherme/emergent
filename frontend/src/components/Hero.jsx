import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shield, Award, MapPin, Phone } from 'lucide-react';
import { mockData } from '../data/mock';

export const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${mockData.company.whatsapp}`, '_blank');
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-green-50 to-white py-20 lg:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2316a34a" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Engenharia de Confiança
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {mockData.hero.title}
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  {mockData.hero.subtitle}
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-green-600" />
                  <span>Normas ABNT</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>Cascavel - PR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Rigor Técnico</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={scrollToContact}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {mockData.hero.ctaText}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={openWhatsApp}
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg font-semibold transition-all duration-300"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  {mockData.hero.ctaSecondary}
                </Button>
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative lg:pl-8">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Perícias Judiciais</h3>
                      <p className="text-gray-600">Análises imparciais e técnicas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                      <Award className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Avaliações de Imóveis</h3>
                      <p className="text-gray-600">Metodologia NBR 14653</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <p className="text-green-800 font-medium text-center">
                      "Compromisso com a verdade dos fatos"
                    </p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full opacity-60"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-green-200 rounded-full opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};