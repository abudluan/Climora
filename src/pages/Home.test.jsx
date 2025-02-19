import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';

test('Componente Home > Renderiza corretamente', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText('Procure o clima de uma cidade ou estado...')).toBeInTheDocument();
});

test('Componente Home > Altera o input de pesquisa corretamente', async () => {
    render(<Home />);

    const input = screen.getByPlaceholderText('Procure o clima de uma cidade ou estado...');
    await userEvent.type(input, 'São Paulo');

    expect(input.value).toBe('São Paulo');
});

test('Componente Home > Exibe sugestões ao digitar', async () => {
    render(<Home />);

    const input = screen.getByPlaceholderText('Procure o clima de uma cidade ou estado...');
    await userEvent.type(input, 'São Paulo');

    await waitFor(() => {
        expect(screen.getByRole('list')).toBeInTheDocument();
    });

    const suggestionItem = await screen.findByText(/São Paulo, Brasil/i);
    expect(suggestionItem).toBeInTheDocument();
});


