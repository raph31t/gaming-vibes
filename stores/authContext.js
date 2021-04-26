import { createContext, useState, useEffect} from 'react'
import netnetlifyIdentity from 'netlify-identity-widget'

const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    authReady: false
})

export const AuthContextProvider = ({children}) => {
const [user, setUser ] = useState(null)

useEffect(() => {

    netnetlifyIdentity.on('login', (user) => {
        setUser(user)
        netnetlifyIdentity.close()
        console.log('New login event')
    })

    netnetlifyIdentity.on('logout', () => {
        setUser(null)
        console.log('New logout event')
    })

    //init netliyfy identity connection
    netnetlifyIdentity.init()

    //Release event at DOM end
    return () => {
        netnetlifyIdentity.off('login')
        netnetlifyIdentity.off('logout')
    }
},[])

const login = () => {
    netnetlifyIdentity.open()
}

const logout = () => {
    netnetlifyIdentity.logout()
}

const context = { user, login, logout}

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext