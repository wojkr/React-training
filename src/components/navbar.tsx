import { Link } from 'react-router-dom'
import { auth } from '../config/firebase'
import { useAuthState } from "react-firebase-hooks/auth"
import { signOut } from 'firebase/auth'

export const Navbar = () => {
    const [user] = useAuthState(auth);

    const signUserOut = async () => {
        await signOut(auth)
    }
    return <nav>
        <div className='nav-links'>
            <Link className='nav-links-link' to="/">Home</Link>
            {!user &&
                <Link className='nav-links-link' to="/login">Login</Link>
            }
            <Link className='nav-links-link' to="/posts">Posts</Link>
            {user &&
                <Link className='nav-links-link' to="/posts">Create post</Link>
            }
        </div>
        {user &&
            <div className='nav-user'>
                <p className='nav-user-name'>{user?.displayName}</p>
                <img src={user?.photoURL || ""} className="nav-user-img" />
                <button onClick={signUserOut} className="nav-user-btn">Logout</button>
            </div>
        }

    </nav>
}