import { NextRequest, NextResponse } from 'next/server';

const CONTACT_EMAIL = 'lyot.bouquerel@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, objet, message, type = 'contact' } = body;

    // Validation des données
    if (!nom || !objet || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Formatage du message texte pour mailto
    const emailBody = `Nouveau message ${type} depuis le site Xulinos

${nom}

${message}

---
Envoyé depuis le formulaire ${type} du site Xulinos`;

    // Version HTML avec balises br pour un meilleur formatage
    const emailBodyHTML = `Nouveau message ${type} depuis le site Xulinos<br><br>
<strong>${nom}</strong><br><br>
${message.replace(/\n/g, '<br>')}<br><br>
---<br>
Envoyé depuis le formulaire ${type} du site Xulinos`;

    // Création du lien mailto avec l'objet personnalisé
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(emailBody)}&html-body=${encodeURIComponent(emailBodyHTML)}`;

    // Enregistrement des données dans les logs (pour référence)
    console.log(`📧 Nouveau message ${type}:`);
    console.log('De:', nom);
    console.log('Objet:', objet);
    console.log('Message:', message);

    // Retourner le lien mailto pour ouverture côté client
    return NextResponse.json(
      { 
        success: true,
        mailtoLink: mailtoLink,
        message: 'Votre message a été préparé. Cliquez sur le bouton pour l\'envoyer via votre client email.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Une erreur interne s\'est produite. Veuillez réessayer.' },
      { status: 500 }
    );
  }
} 