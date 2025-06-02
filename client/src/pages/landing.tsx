import { Button } from "@/components/ui/button";
import { Activity, Timer, Trophy, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FitTimer</h1>
                <p className="text-sm text-gray-600">Entraînement Simple</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Votre coach fitness
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent block">
              personnel
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Découvrez nos séances d'entraînement guidées avec timers automatiques. 
            Full Body, Core & Gainage, et HIIT - tout ce dont vous avez besoin pour rester en forme.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-xl font-semibold"
          >
            Commencer maintenant
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <Timer className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Timers Automatiques</h3>
            <p className="text-gray-600">
              Des transitions fluides entre exercices et repos. Concentrez-vous sur votre entraînement, 
              nous nous occupons du timing.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">3 Types d'Entraînement</h3>
            <p className="text-gray-600">
              Full Body pour le lundi, Core & Gainage pour le mercredi, et HIIT pour le vendredi. 
              Un programme complet.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Suivi des Progrès</h3>
            <p className="text-gray-600">
              Suivez vos séances, votre temps d'entraînement et vos statistiques pour rester motivé.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-500 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Prêt à transformer votre routine fitness ?
          </h3>
          <p className="text-xl text-orange-100 mb-8">
            Rejoignez-nous et commencez votre parcours fitness dès aujourd'hui.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl font-semibold"
          >
            Créer mon compte
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">FitTimer</span>
          </div>
          <p className="text-gray-600">
            Votre partenaire pour un entraînement simple et efficace
          </p>
        </div>
      </footer>
    </div>
  );
}