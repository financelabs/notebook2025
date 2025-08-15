import React from "react";
//import Header from "./header";

const Layout = ({ children }) => {
    
    let title = "Econolabs";
    let author = "Д.А. Головенкин"
  
    return (
      <>
        {/* <Header siteTitle={title} /> */}
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 800,
            padding: '2rem'
          }}
        >
          <main>{children}</main>
          <footer>
            <span style={{color: 'darkgray'}}>
            © {new Date().getFullYear()}, {" "}
            <a href="https://vk.com/id151078439" style={{color: 'darkgray'}}>{author}</a>
            </span>         
          </footer>
        </div>
      </>
    )
  }

  export default Layout