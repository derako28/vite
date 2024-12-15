import {Header} from "../Header/header.jsx";

export const Page = ({children}) => {
    return <>
        <Header />
        {children}
    </>
}