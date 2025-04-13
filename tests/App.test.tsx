import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from '../src/App';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App', () => {
  test('renders Home component by default', () => {
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText(/Start here/i)).toBeInTheDocument();
  });

  test('renders Settings component when navigating to /settings', () => {
    window.history.pushState({}, 'Settings', '/settings');
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
  });

  test('renders Help component when navigating to /help', () => {
    window.history.pushState({}, 'Help', '/help');
    render(
      <Router>
        <App />
      </Router>
    );
    expect(screen.getByText(/Help/i)).toBeInTheDocument();
  });
});
