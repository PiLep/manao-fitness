import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, User, Volume2, Target, LogOut } from 'lucide-react';
import { PolynesianLogo } from '@/components/ui/polynesian-logo';

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

interface UserSettings {
  soundEnabled: boolean;
  difficultyLevel: DifficultyLevel;
  preferredWorkouts: string[];
}

interface SettingsPageProps {
  onBack: () => void;
}

export default function Settings({ onBack }: SettingsPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<UserSettings>({
    soundEnabled: true,
    difficultyLevel: 'beginner',
    preferredWorkouts: []
  });

  const { data: userPreferences } = useQuery({
    queryKey: ['/api/user-preferences'],
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: UserSettings) => {
      await apiRequest('POST', '/api/user-preferences', {
        soundEnabled: newSettings.soundEnabled,
        difficultyLevel: newSettings.difficultyLevel,
        preferredWorkouts: newSettings.preferredWorkouts
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-preferences'] });
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour avec succès.",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (userPreferences) {
      setSettings({
        soundEnabled: userPreferences.soundEnabled ?? true,
        difficultyLevel: userPreferences.difficultyLevel ?? 'beginner',
        preferredWorkouts: userPreferences.preferredWorkouts ?? []
      });
    }
  }, [userPreferences]);

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(settings);
  };

  const getDifficultyDescription = (level: DifficultyLevel) => {
    switch (level) {
      case 'beginner':
        return 'Temps d\'exercice réduits, pauses plus longues';
      case 'intermediate':
        return 'Temps d\'exercice standards, pauses normales';
      case 'advanced':
        return 'Temps d\'exercice étendus, pauses plus courtes';
    }
  };

  const getDifficultyLabel = (level: DifficultyLevel) => {
    switch (level) {
      case 'beginner':
        return 'Débutant';
      case 'intermediate':
        return 'Intermédiaire';
      case 'advanced':
        return 'Avancé';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-100">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20" style={{ maxWidth: '448px', margin: '0 auto' }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
              <PolynesianLogo className="w-5 h-5 text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
              <p className="text-xs text-gray-500">Configuration Manao</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/api/logout'}
            className="text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Scrollable Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6" style={{ paddingTop: '98px' }}>
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profil</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {user?.firstName || user?.email || 'Utilisateur'}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Level Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Niveau de difficulté</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Choisir votre niveau</Label>
              <Select
                value={settings.difficultyLevel}
                onValueChange={(value: DifficultyLevel) => 
                  setSettings(prev => ({ ...prev, difficultyLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">
                    <div>
                      <div className="font-medium">Débutant</div>
                      <div className="text-xs text-gray-500">Idéal pour commencer</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="intermediate">
                    <div>
                      <div className="font-medium">Intermédiaire</div>
                      <div className="text-xs text-gray-500">Niveau standard</div>
                    </div>
                  </SelectItem>
                  <SelectItem value="advanced">
                    <div>
                      <div className="font-medium">Avancé</div>
                      <div className="text-xs text-gray-500">Pour les plus expérimentés</div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                {getDifficultyDescription(settings.difficultyLevel)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sound Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Audio</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound-toggle">Sons de notification</Label>
                <p className="text-sm text-gray-500">Entendre les alertes de fin de timer</p>
              </div>
              <Switch
                id="sound-toggle"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, soundEnabled: checked }))
                }
                style={{ height: '24px', width: '36px', minHeight: '24px', maxHeight: '24px' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSaveSettings}
          className="w-full bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white"
          disabled={saveSettingsMutation.isPending}
        >
          {saveSettingsMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
        </Button>
      </div>
    </div>
  );
}