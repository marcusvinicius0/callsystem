import './dashboard.css';
import { useState } from 'react';

import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [chamados, setChamados] = useState(1);

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Chamados">
                    <FiMessageSquare size={25} />
                </Title>

                {chamados.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum chamado registrado...</span>

                        <Link to="/newcall" className="new">
                            <FiPlus size={25} color="#FFF" />
                            <p> Novo chamado</p>
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/newcall" className="new">
                            <FiPlus size={25} color="#FFF" />
                            <p> Novo chamado</p>
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope="column">Cliente</th>
                                    <th scope="column">Assunto</th>
                                    <th scope="column">Status</th>
                                    <th scope="column">Cadastrado em</th>
                                    <th scope="column">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td data-label="Cliente">Sujeito</td>
                                    <td data-label="Assunto">Suporte</td>
                                    <td data-label="Status">
                                        <span className="badge" style={{backgroundColor: '#5CB85C'}}>Em aberto</span>
                                    </td>
                                    <td data-label="Cadastrado">31/03/2022</td>
                                    <td data-label="#">
                                        <button className="action" style={{backgroundColor: '#3583F6'}}>
                                            <FiSearch color="#FFF" size={17} />
                                        </button>
                                        <button className="action" style={{backgroundColor: '#F6A935'}}>
                                            <FiEdit2 color="#FFF" size={17} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}


            </div>

        </div>
    )
}