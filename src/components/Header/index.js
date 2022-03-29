import { useContext } from 'react';
import './header.css';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';

import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from "react-icons/fi";

export default function Header() {
    const { user } = useContext(AuthContext);

    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarURL === null ? avatar : user.avatarURL} alt="avatar" />
            </div>

            <Link to="/dashboard">
                <FiHome color="#FFF" size={24} />
                Chamados
            </Link>
            <Link to="/customers">
                <FiUser color="#FFF" size={24} />
                Clientes
            </Link>
            <Link to="/profile">
                <FiSettings color="#FFF" size={24} />
                Configurações
            </Link>
        </div>
    )
}