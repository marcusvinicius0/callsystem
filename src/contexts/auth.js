import { useState, createContext, useEffect } from "react";
import firebase from '../services/firebaseConnection';
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        function loadStorage() {
            const storageUser = localStorage.getItem('usersystem');

            if (storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false)
            }

            setLoading(false);
        }

        loadStorage();

    }, [])

    //fazendo login do usuário
    async function signIn(email, password){
        setLoadingAuth(true)

        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(async (value)=>{
            let uid = value.user.uid;

            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                name: userProfile.data().name,
                avatarURL: userProfile.data().avatarURL,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem vindo(a) de volta!')

        })
        .catch((error)=>{
            console.log(error);
            toast.error('Ops, algo deu errado...')
            setLoadingAuth(false);
        })
    }


    //cadastrando um usuário
    async function signUp(email, password, name) {
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                await firebase.firestore().collection('users')
                    .doc(uid).set({
                        name: name,
                        avatarURL: null
                    })
                    .then(() => {
                        let data = {
                            uid: uid,
                            name: name,
                            email: value.user.email,
                            avatarURL: null
                        };

                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        toast.success('Bem vindo(a) a plataforma!');
                    })
            })
            .catch((error) => {
                console.log(error);
                toast.error('Ops, algo deu errado...')
                setLoadingAuth(false);
            })
    }

    function storageUser(data) {
        localStorage.setItem('usersystem', JSON.stringify(data));
    }

    //fazer logout do usuário
    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('usersystem');
        setUser(null);
    }


    return (
        <AuthContext.Provider 
        value={{
            signed: !!user,
            user,
            loading,
            signUp,
            signOut,
            signIn,
            loadingAuth,
            setUser,
            storageUser
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;


