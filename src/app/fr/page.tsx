export default function FrenchHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenue sur Dalili Live
        </h1>
        <p className="text-xl mb-8">
          Votre Guide d'Entreprises en Temps Réel pour la Région MENA
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Trouver des Entreprises</h2>
            <p>Découvrez les meilleures entreprises de la région MENA</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Lire les Avis</h2>
            <p>Découvrez ce que les autres disent des entreprises locales</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Écrire des Avis</h2>
            <p>Partagez vos expériences avec la communauté</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Propriétaires d'Entreprise</h2>
            <p>Réclamez et gérez votre fiche d'entreprise</p>
          </div>
        </div>

        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          Commencer
        </button>
      </div>
    </div>
  );
} 