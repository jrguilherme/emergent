import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { mockData } from '../data/mock';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user starts typing again
    if (submitStatus) {
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };

  const handleServiceChange = (value) => {
    setFormData({
      ...formData,
      service: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await axios.post(`${API}/contacts`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        service: formData.service || null,
        message: formData.message
      });

      if (response.data.success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          message: ''
        });
      }
    } catch (error) {
      setSubmitStatus('error');
      if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else if (error.response?.status === 400) {
        setErrorMessage('Por favor, verifique os dados informados.');
      } else {
        setErrorMessage('Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.');
      }
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de solicitar um orçamento para ${formData.service || 'serviços de engenharia'}.`
    );
    window.open(`https://wa.me/${mockData.company.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 mb-4">
              Contato
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {mockData.contact.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {mockData.contact.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-600 to-green-700 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Informações de Contato</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 mt-1 text-green-200" />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <p className="text-green-100">{mockData.company.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 mt-1 text-green-200" />
                      <div>
                        <p className="font-medium">E-mail</p>
                        <p className="text-green-100">{mockData.company.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 mt-1 text-green-200" />
                      <div>
                        <p className="font-medium">Localização</p>
                        <p className="text-green-100">{mockData.company.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 mt-1 text-green-200" />
                      <div>
                        <p className="font-medium">Horário</p>
                        <p className="text-green-100">Seg - Sex: 8h às 18h</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={openWhatsApp}
                    className="w-full mt-6 bg-white text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">
                    Solicitar Orçamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        Contato enviado com sucesso! Entraremos em contato em breve.
                      </AlertDescription>
                    </Alert>
                  )}

                  {submitStatus === 'error' && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Seu nome completo"
                          required
                          disabled={loading}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          required
                          disabled={loading}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(45) 99999-9999"
                          disabled={loading}
                          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="service">Serviço de interesse</Label>
                        <Select onValueChange={handleServiceChange} disabled={loading}>
                          <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                            <SelectValue placeholder="Selecione um serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockData.services.map((service) => (
                              <SelectItem key={service.id} value={service.title}>
                                {service.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Descreva seu projeto ou necessidade..."
                        rows={4}
                        required
                        disabled={loading}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                      />
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar Solicitação
                        </>
                      )}
                    </Button>

                    {/* Alternative contact option */}
                    {submitStatus === 'error' && (
                      <div className="text-center">
                        <p className="text-gray-600 mb-3">Ou entre em contato diretamente:</p>
                        <Button 
                          type="button"
                          onClick={openWhatsApp}
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};