'use client'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

export default function CgvPage() {
  useEffect(() => {
    document.documentElement.style.background = '#660A43'
    return () => { document.documentElement.style.background = '' }
  }, [])

  return (
    <div style={{ margin: '-24px -16px' }}>
      <style>{`
        @media (max-width: 780px) {
          .cgv-hero { padding-bottom: 56px !important; }
        }
        .cgv-content ul { padding-left: 20px; margin: 8px 0; }
        .cgv-content li { margin-bottom: 6px; }
      `}</style>
      <Header />

      {/* ── HERO ── */}
      <section className="cgv-hero" style={{
        background: 'linear-gradient(180deg, #660A43 0%, #660A43 35%, #8a1258 65%, #660A43 100%)',
        padding: 'clamp(120px,12vw,160px) clamp(16px,5vw,80px) 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(190,25,105,0.45) 0%, transparent 65%)', top: '10%', right: '-8%', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,15,85,0.4) 0%, transparent 65%)', bottom: '-5%', left: '-6%', filter: 'blur(45px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,241,231,0.55)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>
            Légal
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#FFF1E7', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 700, lineHeight: 1.2 }}>
            Conditions Générales de Vente
          </h1>
        </div>

        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', lineHeight: 0, zIndex: 2 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80 }}>
            <path d="M0,35 Q720,58 1440,35 L1440,80 L0,80 Z" fill="#FFF4F7" />
          </svg>
        </div>
      </section>

      {/* ── CONTENU ── */}
      <section style={{ background: '#FFF4F7', padding: 'clamp(32px,4vw,56px) clamp(32px,5vw,80px) clamp(56px,6vw,96px)' }}>
        <div className="cgv-content" style={{ maxWidth: 860, margin: '0 auto' }}>

          <p style={{ color: '#5a3040', fontSize: 14, marginBottom: 40, fontStyle: 'italic' }}>
            Dernière mise à jour : 1er mai 2026
          </p>

          <p style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.85, marginBottom: 40 }}>
            Les présentes Conditions Générales de Vente s'appliquent à toutes les ventes réalisées sur le site abrilove.fr, propriété de la micro-entreprise Abrilove, représentée par Sofiane Daboussi.
          </p>

          <Block title="1. Identité du vendeur">
            <p>
              <strong>Abrilove</strong> – Micro-entreprise (Sofiane Daboussi)<br />
              SIRET : 82384565600011<br />
              Adresse : disponible sur demande<br />
              Email : <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a><br />
              TVA non applicable, article 293B du CGI
            </p>
          </Block>

          <Block title="2. Produits et services">
            <p>Abrilove propose à la vente :</p>
            <ul>
              <li>Des <strong>produits numériques</strong> (e-books, guides PDF, contenus audio/vidéo)</li>
              <li>Des <strong>abonnements numériques</strong> (Abr(IA) — accès mensuel ou annuel au widget IA)</li>
              <li>Des <strong>prestations de service</strong> (coaching, accompagnement, formations en ligne)</li>
              <li>Des <strong>produits physiques</strong> (ex : t-shirts, papeterie, accessoires)</li>
            </ul>
            <p>Les caractéristiques essentielles de chaque produit sont indiquées sur la page correspondante.</p>
          </Block>

          <Block title="3. Commandes">
            <p>
              Toute commande passée sur le site implique l'adhésion pleine et entière aux présentes CGV.<br /><br />
              Après validation du paiement, un email de confirmation est envoyé. L'accès aux produits numériques est immédiat ou se fait via un lien envoyé par mail. Pour les abonnements, l'accès au service est activé immédiatement après paiement. Pour les services, un contact direct est pris pour planifier la prestation.
            </p>
          </Block>

          <Block title="4. Prix">
            <p>
              Les prix sont indiqués en euros, toutes taxes comprises.<br />
              Abrilove étant une micro-entreprise, la TVA n'est pas applicable.<br />
              Les prix peuvent être modifiés à tout moment, mais les produits seront facturés sur la base du tarif en vigueur au moment de la validation de la commande.
            </p>
          </Block>

          <Block title="5. Modalités de paiement">
            <p>
              Le paiement s'effectue en ligne via des services sécurisés (Stripe).<br />
              Les informations bancaires ne sont jamais accessibles à Abrilove.<br /><br />
              Pour les abonnements, le paiement est prélevé automatiquement à chaque échéance (mensuelle ou annuelle) via Stripe. L'abonné peut résilier à tout moment depuis son espace ou en écrivant à <a href="mailto:bonjour@abrilove.fr" style={{ color: '#660A43' }}>bonjour@abrilove.fr</a>.
            </p>
          </Block>

          <Block title="5bis. Abonnement Abr(IA) — conditions spécifiques">
            <p>L'abonnement Abr(IA) donne accès à un widget d'intelligence artificielle entraîné sur les contenus et la méthode Abrilove. Les conditions suivantes s'appliquent en complément des présentes CGV :</p>
            <ul>
              <li><strong>Renouvellement automatique :</strong> l'abonnement est reconduit tacitement à chaque échéance. L'abonné peut résilier à tout moment, l'accès reste actif jusqu'à la fin de la période payée.</li>
              <li><strong>Préavis de changement de prix :</strong> toute modification tarifaire sera communiquée par email au moins 30 jours avant sa prise d'effet. L'abonné peut résilier sans frais avant la date d'application.</li>
              <li><strong>Disponibilité du service :</strong> Abrilove s'engage à maintenir le service disponible, mais ne peut garantir une disponibilité continue à 100 % (maintenance, incidents techniques). En cas d'interruption prolongée dépassant 72h consécutives, un avoir ou report pourra être envisagé.</li>
              <li><strong>Données et conversations :</strong> les conversations sont conservées pendant la durée de l'abonnement actif, puis supprimées dans un délai de 12 mois après résiliation ou dernière connexion (voir politique de confidentialité).</li>
              <li><strong>Usage personnel :</strong> l'abonnement est strictement personnel et non cessible. Tout usage commercial, revente ou partage de compte est interdit.</li>
              <li><strong>Nature du service IA :</strong> les réponses du widget sont générées par intelligence artificielle et ne constituent pas un avis médical, juridique ou psychologique. Abrilove ne peut être tenue responsable des décisions prises sur la base de ces échanges.</li>
            </ul>
          </Block>

          <Block title="6. Livraison">
            <SubTitle>Produits numériques :</SubTitle>
            <p>Livrés immédiatement par email ou via une page de téléchargement. Le client est responsable de l'exactitude de son adresse email.</p>

            <SubTitle>Abonnement Abr(IA) :</SubTitle>
            <p>L'accès au service est activé immédiatement après paiement. En cas de résiliation, l'accès reste actif jusqu'à la fin de la période en cours.</p>

            <SubTitle>Produits physiques :</SubTitle>
            <p>Expédiés à l'adresse indiquée lors de la commande. Les délais sont précisés sur la fiche produit. Abrilove ne peut être tenue responsable des retards dus au transporteur.</p>

            <SubTitle>Coaching / formations :</SubTitle>
            <p>Le client reçoit un email avec les instructions pour réserver son créneau. Les modalités sont précisées dans la page de vente.</p>
          </Block>

          <Block title="7. Droit de rétractation">
            <p>Conformément à l'article L221-28 du Code de la consommation :</p>
            <ul>
              <li><strong>Produits numériques :</strong> le droit de rétractation ne s'applique pas une fois le téléchargement ou l'accès commencé.</li>
              <li><strong>Abonnement Abr(IA) :</strong> le droit de rétractation de 14 jours s'applique à compter de la souscription, à condition que le service n'ait pas été utilisé. Passé ce délai ou en cas d'utilisation, aucun remboursement ne sera effectué pour la période en cours.</li>
              <li><strong>Coaching / services :</strong> rétractation possible jusqu'à 48h avant le rendez-vous. Passé ce délai, la prestation est due.</li>
              <li><strong>Produits physiques :</strong> le client dispose d'un délai de 14 jours à compter de la réception pour exercer son droit de rétractation. Les produits doivent être retournés en parfait état, à la charge du client.</li>
            </ul>
            <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux prestations de loisirs fournies à une date déterminée. Les ateliers proposés sur le site étant organisés à une date précise, l'achat d'une place est ferme et définitif et ne peut donner lieu à remboursement.</p>
          </Block>

          <Block title="8. Politique de remboursement">
            <p>Aucun remboursement ne sera effectué pour :</p>
            <ul>
              <li>Les produits numériques après accès ou livraison</li>
              <li>L'abonnement Abr(IA) en cours d'utilisation ou après le délai de rétractation</li>
              <li>Les séances annulées hors délai</li>
              <li>Les produits physiques retournés usagés ou incomplets</li>
            </ul>
            <p>En cas d'erreur manifeste (fichier illisible, défaut technique), une solution de remplacement ou un remboursement pourra être envisagé après analyse.</p>
          </Block>

          <Block title="9. Responsabilité">
            <p>
              Abrilove ne peut être tenue responsable de l'usage fait par le client des contenus achetés, ni des résultats obtenus à partir des conseils proposés.<br />
              Les produits et services ne remplacent en aucun cas un avis médical, juridique ou psychologique.
            </p>
          </Block>

          <Block title="10. Propriété intellectuelle">
            <p>
              Tous les contenus (textes, visuels, audios, vidéos, e-books, templates) restent la propriété exclusive d'Abrilove.<br />
              Toute reproduction, modification, revente ou diffusion sans autorisation est strictement interdite.
            </p>
          </Block>

          <Block title="11. Données personnelles">
            <p>
              Les données collectées dans le cadre des commandes ou de la newsletter sont utilisées uniquement dans le cadre d'Abrilove.<br />
              Elles sont traitées selon la <a href="/politique-de-confidentialite" style={{ color: '#660A43' }}>politique de confidentialité</a> disponible sur le site.
            </p>
          </Block>

          <Block title="12. Litiges">
            <p>
              En cas de litige, une solution amiable sera d'abord recherchée.<br />
              À défaut, le litige relèvera du droit français et de la compétence exclusive des tribunaux du ressort du siège d'Abrilove.
            </p>
          </Block>

          <Block title="Règlement amiable des litiges — Médiation de la consommation" last>
            <p>
              Conformément aux dispositions des articles L 611-1 et R 612-1 et suivants du Code de la Consommation concernant le règlement amiable des litiges :<br /><br />
              Lorsque le consommateur a adressé une réclamation écrite au professionnel et qu'il n'a pas obtenu satisfaction ou de réponse dans un délai de deux mois, il peut soumettre gratuitement sa réclamation au médiateur de la consommation. Le médiateur doit être saisi dans le délai maximal d'un an à compter de la réclamation initiale.<br /><br />
              Le médiateur MCP MÉDIATION peut être saisi directement en ligne à l'adresse suivante : <a href="https://www.mcpmediation.org" target="_blank" rel="noopener noreferrer" style={{ color: '#660A43' }}>www.mcpmediation.org</a> ou par courrier :<br /><br />
              <strong>MÉDIATION DE LA CONSOMMATION et PATRIMOINE</strong><br />
              12 Square Desnouettes – 75015 PARIS
            </p>
          </Block>

        </div>
      </section>

      <Footer />
    </div>
  )
}

function SubTitle({ children }) {
  return (
    <p style={{ color: '#660A43', fontWeight: 600, fontSize: 14, marginTop: 20, marginBottom: 8 }}>
      {children}
    </p>
  )
}

function Block({ title, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 40, paddingBottom: last ? 0 : 40, borderBottom: last ? 'none' : '1px solid rgba(102,10,67,0.1)' }}>
      <h2 style={{ fontFamily: 'var(--font-playfair,serif)', color: '#660A43', fontSize: 20, fontWeight: 700, marginBottom: 14, lineHeight: 1.2 }}>
        {title}
      </h2>
      <div style={{ color: '#5a3040', fontSize: 15, lineHeight: 1.85 }}>
        {children}
      </div>
    </div>
  )
}
