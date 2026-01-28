/**
 * Tests pour le composant RegistrationSection
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationSection } from '@/components/RegistrationSection';

// Mock du toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('RegistrationSection', () => {
  it('devrait afficher le formulaire d\'inscription', () => {
    render(<RegistrationSection />);
    
    expect(screen.getByText(/Commencez votre histoire d'amour/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('devrait afficher les erreurs de validation pour les champs requis', async () => {
    const user = userEvent.setup();
    render(<RegistrationSection />);
    
    const submitButton = screen.getByRole('button', { name: /Envoyer mon inscription/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Le prénom doit contenir au moins 2 caractères/i)).toBeInTheDocument();
    });
  });

  it('devrait valider le format de l\'email', async () => {
    const user = userEvent.setup();
    render(<RegistrationSection />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    await user.type(emailInput, 'email-invalide');
    
    const submitButton = screen.getByRole('button', { name: /Envoyer mon inscription/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Adresse email invalide/i)).toBeInTheDocument();
    });
  });

  it('devrait valider l\'âge minimum', async () => {
    const user = userEvent.setup();
    render(<RegistrationSection />);
    
    const ageInput = screen.getByLabelText(/Âge/i);
    await user.type(ageInput, '16');
    
    const submitButton = screen.getByRole('button', { name: /Envoyer mon inscription/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Vous devez avoir au moins 18 ans/i)).toBeInTheDocument();
    });
  });

  it('devrait compter les caractères de la présentation', async () => {
    const user = userEvent.setup();
    render(<RegistrationSection />);
    
    const presentationInput = screen.getByLabelText(/Présentez-vous/i);
    await user.type(presentationInput, 'Test');

    await waitFor(() => {
      expect(screen.getByText(/4\/1000/i)).toBeInTheDocument();
    });
  });

  it('devrait soumettre le formulaire avec des données valides', async () => {
    const user = userEvent.setup();
    render(<RegistrationSection />);
    
    // Remplir tous les champs requis
    await user.type(screen.getByLabelText(/Prénom/i), 'Jean');
    await user.type(screen.getByLabelText(/Nom/i), 'Dupont');
    await user.type(screen.getByLabelText(/Email/i), 'jean.dupont@example.com');
    await user.type(screen.getByLabelText(/Téléphone/i), '0612345678');
    await user.type(screen.getByLabelText(/Âge/i), '30');
    await user.type(screen.getByLabelText(/Ville/i), 'Paris');
    await user.type(
      screen.getByLabelText(/Présentez-vous/i), 
      'Je suis une personne passionnée par la vie et je cherche à partager des moments uniques.'
    );
    await user.type(
      screen.getByLabelText(/Que recherchez-vous/i), 
      'Je recherche une relation sérieuse et durable.'
    );
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    const submitButton = screen.getByRole('button', { name: /Envoyer mon inscription/i });
    await user.click(submitButton);

    // Vérifier que le bouton est désactivé pendant la soumission
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/Envoi en cours/i)).toBeInTheDocument();
  });
});
