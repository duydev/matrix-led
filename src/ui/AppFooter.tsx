import {
  APP_AUTHOR_EMAIL,
  APP_AUTHOR_NAME,
  APP_LICENSE,
  APP_REPO_URL,
  APP_VERSION,
} from '../meta';

export function AppFooter() {
  return (
    <footer className="app-footer" data-testid="app-footer">
      <p className="app-footer__primary">
        <span data-testid="app-version">v{APP_VERSION}</span>
        <span className="app-footer__sep" aria-hidden="true">
          ·
        </span>
        <a
          className="app-footer__link"
          href={`mailto:${APP_AUTHOR_EMAIL}`}
          data-testid="app-author-email"
        >
          {APP_AUTHOR_NAME}
        </a>
        <span className="app-footer__sep" aria-hidden="true">
          ·
        </span>
        <a
          className="app-footer__link"
          href={APP_REPO_URL}
          target="_blank"
          rel="noreferrer"
          data-testid="app-repo-link"
        >
          GitHub
        </a>
      </p>
      <p className="app-footer__secondary">
        © {new Date().getFullYear()} {APP_AUTHOR_NAME} · {APP_LICENSE}
      </p>
    </footer>
  );
}
