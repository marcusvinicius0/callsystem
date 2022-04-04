import './dashboard.css';
import { useState, useEffect } from 'react';

import Header from "../../components/Header";
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format, setDate } from 'date-fns';

import firebase from '../../services/firebaseConnection';
import Modal from '../../components/Modal';

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard() {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {

        loadChamados();

        return () => {

        }

    }, []);

    async function loadChamados() {
      await listRef.limit(5)
      .get()
      .then((snapshot)=>{
          updateState(snapshot)
      })
      .catch((error)=>{
        console.log('Deu algum erro: ', error);
        setLoadingMore(false);
      })

      setLoading(false);
    }

    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clientId: doc.data().clientId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; //pegando o ultimo documento buscado.

            setChamados(chamados => [...chamados, ...lista]);
            setLastDocs(lastDoc);

        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);

    }

    async function handleMore(){
        setLoadingMore(true);
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
    }

    function togglePostModal(item){
        setShowPostModal(!showPostModal) //troca de true pra false
        setDetail(item);
    }

    if (loading) {
        return (
            <div>
                <Header />

                <div className="content">
                    <Title name="Atendimentos">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>

                </div>
            </div>
        )
    }


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
                                {chamados.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5CB85C' : '#999' }}>{item.status}</span>
                                            </td>
                                            <td data-label="Cadastrado">{item.createdFormated}</td>
                                            <td data-label="#">
                                                <button className="action" style={{ backgroundColor: '#3583F6' }} onClick={()=> togglePostModal(item)}>
                                                    <FiSearch color="#FFF" size={17} />
                                                </button>
                                                <Link className="action" style={{ backgroundColor: '#F6A935' }} to={`/newcall/${item.id}`}>
                                                    <FiEdit2 color="#FFF" size={17} />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15 }}>Buscando dados...</h3>}
                        { !loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}

                    </>
                )}

            </div>

            {showPostModal && (
                <Modal
                    conteudo={detail}
                    close={togglePostModal}
                />
            )}


        </div>
    )
}