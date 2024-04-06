import React, {useState} from 'react';

import Login from './Login';
import Register from './Register';

type Prp = {
    screen?: string
}

const LHandler = (props: Prp)=>{
    const [isOnLogin, setIsOnLogin] = useState(props.screen == "Register" ? false : true);
    const change_screen = (screen_name: string) => {
        setIsOnLogin(screen_name == "Register" ? false : true);
    }
    
    if(isOnLogin){
        return <Login change_screen={change_screen} />
    }else{
        return <Register change_screen={change_screen} />
    }
}

export default LHandler;