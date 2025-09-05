import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  FileText, 
  Scale, 
  Home, 
  Building, 
  Wrench, 
  ClipboardList,
  ChevronRight,
  Check
} from 'lucide-react';
import { mockData } from '../data/mock';

export const Services = () => {
  const [hoveredService, setHoveredService] = useState(null);

  const serviceIcons = [FileText, Scale, Home, Building, Wrench, ClipboardList];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 mb-4">
              Nossos Serviços
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Soluções Completas em Engenharia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Oferecemos uma gama completa de serviços especializados com rigor técnico e transparência absoluta
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockData.services.map((service, index) => {
              const IconComponent = serviceIcons[index];
              const isHovered = hoveredService === service.id;

              return (
                <Card 
                  key={service.id}
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                  className={`border-0 shadow-lg transition-all duration-300 transform cursor-pointer group ${
                    isHovered 
                      ? 'shadow-2xl -translate-y-3 bg-gradient-to-br from-green-600 to-green-700 text-white' 
                      : 'hover:shadow-xl hover:-translate-y-1 bg-white'
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                      isHovered 
                        ? 'bg-white/20' 
                        : 'bg-green-100 group-hover:bg-green-200'
                    }`}>
                      <IconComponent className={`w-8 h-8 transition-colors duration-300 ${
                        isHovered ? 'text-white' : 'text-green-600'
                      }`} />
                    </div>
                    <CardTitle className={`text-xl font-bold transition-colors duration-300 ${
                      isHovered ? 'text-white' : 'text-gray-900'
                    }`}>
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className={`leading-relaxed transition-colors duration-300 ${
                      isHovered ? 'text-green-50' : 'text-gray-600'
                    }`}>
                      {service.description}
                    </p>
                    
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Check className={`w-4 h-4 flex-shrink-0 transition-colors duration-300 ${
                            isHovered ? 'text-green-200' : 'text-green-500'
                          }`} />
                          <span className={`text-sm transition-colors duration-300 ${
                            isHovered ? 'text-green-50' : 'text-gray-600'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={scrollToContact}
                      variant={isHovered ? "secondary" : "outline"}
                      className={`w-full mt-6 transition-all duration-300 ${
                        isHovered 
                          ? 'bg-white text-green-600 hover:bg-green-50' 
                          : 'border-green-600 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      Solicitar Orçamento
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-green-100">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Precisa de um serviço personalizado?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Entre em contato conosco para discutir suas necessidades específicas. 
                Desenvolvemos soluções sob medida para cada projeto.
              </p>
              <Button 
                size="lg"
                onClick={scrollToContact}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};