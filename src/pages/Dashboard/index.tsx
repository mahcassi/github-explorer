import React, { useState, useEffect, FormEvent } from 'react';

import { Title, Form, Repositories, Error } from './styles';

import api from '../../services/api';

import { FiChevronRight } from 'react-icons/fi';

import { Link } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

//Adição de um novo repositório
//Consumir API do GitHub
//Salvar novo repositório no estado

const Dashboard: React.FC = () => {
    //armazena valor do input
    const [newRepo, setNewRepo] = useState('');

    //valor do estado em si  // mudar valor   
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storagedRepositories){
            return JSON.parse(storagedRepositories);//convertendo pra array dnv
        }else{
            return [];
        }
    });                                 

    const [inputError, setInputError] = useState('');

    useEffect(() => {
       localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));

    }, [repositories]);

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {

        event.preventDefault();

        if (!newRepo) {
            setInputError('Digite o autor/nome do repositório');
            return;
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);

            const repository = response.data;
            setRepositories([...repositories, repository]);
            setNewRepo('');
            setInputError('');

        } catch (err) {
            setInputError('Erro na busca por esse repositório');
        }
    }

    return (
        <>
            <img src={logoImg} alt="GitHub Explorer" />
            <Title>Explore repositórios no GitHub</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input value={newRepo}
                    onChange={(e) => setNewRepo(e.target.value)}
                    placeholder="Digite o nome do repositório"
                />
                <button type="submit">Pesquisar</button>
            </Form>

            {inputError && <Error>{inputError}</Error>}

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    );
};
export default Dashboard;
