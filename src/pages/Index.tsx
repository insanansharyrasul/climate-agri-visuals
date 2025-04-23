import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartPie, BarChartBig, LineChart } from 'lucide-react';
import AdaptationPieChart from '@/components/charts/AdaptationPieChart';

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState('Global');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-sage-900 animate-fade-in">
            Climate Change Impact on Agriculture Analysis
          </h1>
          <div className="text-sage-600 space-y-1 animate-fade-in">
            <a 
              href="https://www.kaggle.com/datasets/waqi786/climate-change-impact-on-agriculture" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sage-700 hover:text-sage-900 underline transition-colors"
            >
              Dataset source: Kaggle - Climate Change Impact on Agriculture
            </a>
            <div className="text-sm">
              Created by Kelompok 1<br />
              Mata Kuliah KOM1304 - Grafika Komputer dan Visualisasi<br />
              Paralel K3
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs mx-auto animate-fade-in">
          <Select onValueChange={setSelectedCountry} defaultValue={selectedCountry}>
            <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border border-sage-200 text-sage-900">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Global">Global</SelectItem>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="China">China</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="Russia">Russia</SelectItem>
                <SelectItem value="Brazil">Brazil</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="adaptation" className="w-full animate-fade-in">
          <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="adaptation" className="data-[state=active]:bg-sage-600 data-[state=active]:text-white">
              <ChartPie className="w-4 h-4 mr-2" />
              Adaptation
            </TabsTrigger>
            <TabsTrigger value="economic" className="data-[state=active]:bg-sage-600 data-[state=active]:text-white">
              <BarChartBig className="w-4 h-4 mr-2" />
              Economic
            </TabsTrigger>
            <TabsTrigger value="emissions" className="data-[state=active]:bg-sage-600 data-[state=active]:text-white">
              <LineChart className="w-4 h-4 mr-2" />
              Emissions
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="adaptation">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-sage-100">
                <h2 className="text-xl font-semibold text-sage-900 mb-4 text-center">
                  Adaptation Strategies Distribution
                </h2>
                <AdaptationPieChart selectedCountry={selectedCountry} />
              </Card>
            </TabsContent>

            <TabsContent value="economic">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-sage-100">
                <h2 className="text-xl font-semibold text-sage-900 mb-4 text-center">
                  Economic Impact by Crop Type
                </h2>
                <div id="bar-chart" className="h-[500px] w-full" />
              </Card>
            </TabsContent>

            <TabsContent value="emissions">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-sage-100">
                <h2 className="text-xl font-semibold text-sage-900 mb-4 text-center">
                  CO₂ Emissions Over Time
                </h2>
                <div id="line-chart" className="h-[500px] w-full" />
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
