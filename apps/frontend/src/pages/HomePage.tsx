import { Link } from 'react-router-dom';
import { ArrowIcon } from '../components/ArrowIcon';
import { Navbar } from '../components/Navbar';
import { SiteFooter } from '../components/SiteFooter';

export function HomePage() {
  return (
    <div className="site-shell">
      <Navbar />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="kicker">
              <span className="status-dot" /> Conçu pour les PME africaines
            </p>
            <h1 id="hero-title">
              Pilotez votre activité. <em>Simplement.</em>
            </h1>
            <p className="hero-lead">
              Des outils Excel professionnels, prêts à l’emploi et adaptés à la réalité de
              votre business.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/catalogue">
                Explorer le catalogue <ArrowIcon />
              </Link>
              <button className="watch-link" type="button">
                <span className="play">▶</span> Voir comment ça marche
              </button>
            </div>
            <div className="hero-proof">
              <div className="avatars" aria-hidden="true">
                <span>AK</span>
                <span>SM</span>
                <span>CN</span>
              </div>
              <p>
                <strong>+1 200 entrepreneurs</strong>
                <br />
                organisent déjà leur activité.
              </p>
            </div>
          </div>

          <div className="hero-visual" aria-label="Aperçu d’un tableau de bord ExcelHub">
            <div className="glow glow-one" />
            <div className="glow glow-two" />
            <div className="dashboard-card">
              <div className="dashboard-head">
                <span>
                  <i /> Résumé de l’activité
                </span>
                <b>•••</b>
              </div>
              <div className="metrics">
                <div>
                  <small>Ventes du mois</small>
                  <strong>
                    2 450 000 <small>FCFA</small>
                  </strong>
                  <em>↗ +18,4%</em>
                </div>
                <div className="metric-ring">
                  72<small>%</small>
                </div>
              </div>
              <div className="chart">
                <div className="chart-label">
                  <span>Revenus</span>
                  <b>Cette semaine⌄</b>
                </div>
                <svg viewBox="0 0 360 104" role="img" aria-label="Graphique des revenus">
                  <path
                    d="M0 95 C25 88 28 70 48 75 S70 60 86 65 S115 50 132 58 S157 32 178 45 S212 22 235 34 S260 14 278 22 S310 5 360 10 V104 H0Z"
                    fill="url(#fill)"
                  />
                  <path
                    d="M0 95 C25 88 28 70 48 75 S70 60 86 65 S115 50 132 58 S157 32 178 45 S212 22 235 34 S260 14 278 22 S310 5 360 10"
                    fill="none"
                    stroke="#1fbf75"
                    strokeWidth="3"
                  />
                  <defs>
                    <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                      <stop stopColor="#1fbf75" stopOpacity=".26" />
                      <stop offset="1" stopColor="#1fbf75" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="dashboard-footer">
                <span>Dernières ventes</span>
                <span className="mini-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
            <div className="floating-card">
              <span className="check">✓</span>
              <div>
                <small>Objectif mensuel</small>
                <strong>72% atteint</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Avantages ExcelHub Africa">
          <p>
            <b>Adapté localement</b>
            <span>FCFA, Mobile Money, réalités terrain</span>
          </p>
          <p>
            <b>Prêt à l’emploi</b>
            <span>Téléchargez, ouvrez, commencez</span>
          </p>
          <p>
            <b>Support humain</b>
            <span>Nous restons à vos côtés</span>
          </p>
        </section>

        <section className="mission section" aria-labelledby="mission-title">
          <div className="mission-grid">
            <div>
              <p className="kicker">Notre mission</p>
              <h2 id="mission-title">
                Donner aux PME africaines les outils des grandes entreprises.
              </h2>
              <p className="mission-lead">
                ExcelHub Africa conçoit des fichiers Excel de gestion professionnels,
                pensés pour la réalité du terrain : prix en FCFA, Mobile Money, langue
                française, sans jargon ni logiciel compliqué. Notre objectif : permettre à
                chaque commerçant, pharmacien ou gérant de restaurant de piloter son
                activité comme un professionnel, en moins de 5 minutes et sans compétence
                technique.
              </p>
            </div>
            <div className="mission-stats">
              <div>
                <strong>6</strong>
                <span>métiers couverts</span>
              </div>
              <div>
                <strong>4</strong>
                <span>opérateurs Mobile Money</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>en français</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="steps section"
          id="comment-ca-marche"
          aria-labelledby="steps-title"
        >
          <div className="section-heading">
            <div>
              <p className="kicker">Simple par nature</p>
              <h2 id="steps-title">De l’achat à la maîtrise, en quelques minutes.</h2>
            </div>
          </div>
          <div className="steps-grid">
            <article>
              <span>01</span>
              <h3>Choisissez</h3>
              <p>Trouvez l’outil conçu pour votre métier.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Téléchargez</h3>
              <p>Paiement sécurisé, accès immédiat à votre fichier.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Pilotez</h3>
              <p>Une gestion claire, dès la première utilisation.</p>
            </article>
          </div>
        </section>

        <section className="cta-section" id="pourquoi">
          <p className="kicker">Votre business mérite mieux</p>
          <h2>
            Moins de chaos.
            <br />
            <em>Plus de contrôle.</em>
          </h2>
          <Link className="button button-light" to="/catalogue">
            Trouver mon outil <ArrowIcon />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
