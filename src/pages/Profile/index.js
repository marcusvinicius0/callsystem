import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import { FiSettings, FiUpload } from 'react-icons/fi';

export default function Profile() {
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);

    const [avatarURL, setAvatarURL] = useState(user && user.avatarURL);
    const [imgAvatar, setImgAvatar] = useState(null);

  async function handleSave(e){
        e.preventDefault();
     
        if(imgAvatar === null && name !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                name: name
            })
            .then(()=>{
                let data = {
                    ...user,
                    name: name
                };
                setUser(data);
                storageUser(data);
            })
        }

    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSave}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>

                            <input type="file" accept="image/*" /> <br />
                            {avatarURL === null ?
                                <img src={avatar} width="250" height="250" alt="user-profile-pic" />
                                :
                                <img src={avatarURL} width="250" height="250" alt="user-profile-pic" />
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">Salvar</button>

                    </form>
                </div>

                <div className="container">
                    <button className="logout-btn" onClick={ () => signOut() } >
                        Sair
                    </button>
                </div>
            </div>
        </div>
    )
}