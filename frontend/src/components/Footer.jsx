import siteConfig from "../content/site";
import "./Footer.css";

/** Подвал сайта: соцссылки и копирайт — контент берётся из site.js. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__row">
        <span className="footer__name">{siteConfig.name}</span>

        <div className="footer__links">
          {siteConfig.socials.map((social) => (
            <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          )}
        </div>
      </div>
      <p className="footer__copy">© {year} {siteConfig.name}. Все права защищены.</p>
    </footer>
  );
}
