import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, Target, Clock, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveDifficultyMutation = useMutation({
    mutationFn: async (difficulty: DifficultyLevel) => {
      const response = await fetch('/api/user-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soundEnabled: true,
          difficultyLevel: difficulty,
          preferredWorkouts: [],
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-preferences'] });
      toast({
        title: "Bienvenue dans Manao !",
        description: "Votre niveau de difficulté a été configuré.",
      });
      onComplete();
    },
    onError: (error) => {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences.",
        variant: "destructive",
      });
    },
  });

  const handleContinue = () => {
    if (selectedDifficulty) {
      saveDifficultyMutation.mutate(selectedDifficulty);
    }
  };

  const difficultyOptions = [
    {
      level: 'beginner' as DifficultyLevel,
      title: 'Débutant',
      description: 'Je commence le fitness ou je reprends après une pause',
      details: [
        'Exercices plus courts (-30%)',
        'Pauses réduites entre exercices',
        'Moins de répétitions (-20%)',
        'Parfait pour débuter en douceur'
      ],
      icon: Target,
      color: 'bg-green-100 text-green-700 border-green-300'
    },
    {
      level: 'intermediate' as DifficultyLevel,
      title: 'Intermédiaire',
      description: 'Je fais du sport régulièrement',
      details: [
        'Durée normale des exercices',
        'Pauses réduites entre exercices (-40%)',
        'Répétitions standards',
        'Équilibre entre défi et récupération'
      ],
      icon: Clock,
      color: 'bg-orange-100 text-orange-700 border-orange-300'
    },
    {
      level: 'advanced' as DifficultyLevel,
      title: 'Avancé',
      description: 'Je suis un sportif confirmé',
      details: [
        'Exercices plus longs (+30%)',
        'Pauses très réduites (-60%)',
        'Plus de répétitions (+20%)',
        'Challenge maximum'
      ],
      icon: Zap,
      color: 'bg-red-100 text-red-700 border-red-300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenue dans Manao !</h1>
          <p className="text-gray-600">Choisissez votre niveau pour personnaliser vos entraînements</p>
        </div>

        <div className="space-y-4 mb-8">
          {difficultyOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedDifficulty === option.level;
            
            return (
              <Card
                key={option.level}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'ring-2 ring-teal-500 bg-teal-50 border-teal-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDifficulty(option.level)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${option.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{option.title}</h3>
                        {isSelected && (
                          <Badge className="bg-teal-500 text-white">Sélectionné</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{option.description}</p>
                      <ul className="space-y-1">
                        {option.details.map((detail, index) => (
                          <li key={index} className="text-sm text-gray-500 flex items-center">
                            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedDifficulty || saveDifficultyMutation.isPending}
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition-colors disabled:opacity-50"
          >
            {saveDifficultyMutation.isPending ? (
              "Configuration..."
            ) : (
              <>
                Commencer l'aventure
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}