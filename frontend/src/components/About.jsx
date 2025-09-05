import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Target, Users } from 'lucide-react';
import { mockData } from '../data/mock';

export const About = () => {
  const featureIcons = [CheckCircle, Target, Users];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 mb-4">
              Sobre a Mensura Maat
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {mockData.about.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {mockData.about.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {mockData.about.features.map((feature, index) => {
              const IconComponent = featureIcons[index];
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-green-50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats or Additional Info */}
          <div className="bg-green-600 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">10+</div>
                <div className="text-green-100">Anos de Experiência</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">500+</div>
                <div className="text-green-100">Projetos Realizados</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">100%</div>
                <div className="text-green-100">Conformidade Técnica</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};