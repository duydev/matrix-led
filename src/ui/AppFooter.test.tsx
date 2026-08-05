import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppFooter } from './AppFooter';
import {
  APP_AUTHOR_EMAIL,
  APP_AUTHOR_NAME,
  APP_LICENSE,
  APP_REPO_URL,
  APP_VERSION,
} from '../meta';

describe('AppFooter', () => {
  it('shows version, author, license, and repo link', () => {
    render(<AppFooter />);
    expect(screen.getByTestId('app-version')).toHaveTextContent(
      `v${APP_VERSION}`,
    );
    expect(screen.getByTestId('app-author-email')).toHaveTextContent(
      APP_AUTHOR_NAME,
    );
    expect(screen.getByTestId('app-author-email')).toHaveAttribute(
      'href',
      `mailto:${APP_AUTHOR_EMAIL}`,
    );
    expect(screen.getByTestId('app-repo-link')).toHaveAttribute(
      'href',
      APP_REPO_URL,
    );
    expect(screen.getByTestId('app-footer')).toHaveTextContent(APP_LICENSE);
  });
});
