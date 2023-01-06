import { Link } from "react-router-dom"

export const Main = () => {
    return <main className="container container-bigger">
        <h1>HOME PAGE</h1>
        <p className="border-bottom">Simple page to refresh my react skills. First try with Typescript and firebase.</p>
        <p>Check all added <Link className="Link" to="/posts">posts</Link> and create one by yourself</p>
        <p>Don't register, just use your Google account to <Link className="Link" to="/login">log in</Link> and explore CRUD powered by Firebase</p>
    </main >
}