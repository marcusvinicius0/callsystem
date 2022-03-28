import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SingIn';
import SignUp from '../pages/SingUp';

import Dashboard from '../pages/Dashboard';

export default function Routes(){

    return(
        <Switch>    
            <Route exact path="/" component={SignIn} />
            <Route exact path="/register" component={SignUp} />
            <Route exact path="/dashboard" component={Dashboard} isPrivate />
        </Switch>
    )
}

//switch faz renderizar um component por pagina.