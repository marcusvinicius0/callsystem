import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';

import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import { FiSettings, FiUpload } from 'react-icons/fi';
import { toast } from "react-toastify"

export default function Profile() {
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);

    const [avatarURL, setAvatarURL] = useState(user && user.avatarURL);
    const [imageAvatar, setImageAvatar] = useState(null);


    function handleFile(e){

        if(e.target.files[0]){
            const image = e.target.files[0];

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image);
                setAvatarURL(URL.createObjectURL(e.target.files[0]))
            }else{
                alert('Envie uma imagem do tipo PNG ou JPEG')
                setImageAvatar(null);
                return null;
            }
        }
    }


  async function handleUpload(){
        const currentUid = user.uid;

        const updloadTask = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then(async ()=>{
            console.log('Foto enviada com sucesso.');

            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then(async (url)=>{
                let urlFoto = url;

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarURL: urlFoto,
                    name: name
                })
                .then(()=>{
                    let data = {
                        ...user,
                        avatarURL: urlFoto,
                        name: name
                    };
                    setUser(data);
                    storageUser(data);
                })
            })

        })
    }


  async function handleSave(e){
        e.preventDefault();     //faz não atualizar a pagina
     
        if(imageAvatar === null && name !== ''){
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
        else if(name !== '' && avatarURL !== null){
            handleUpload();
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

                            <input type="file" accept="image/*" onChange={handleFile} /> <br />
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