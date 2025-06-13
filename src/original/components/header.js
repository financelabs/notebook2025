
import React from "react"

const Header = ({ siteTitle }) => (
  <nav className="navbar  navbar-light bg-light "> {/* navbar-dark bg-primary */}

    <h3 style={{ margin: 0 }}>
        <a href="/" style={{ color: `gray`, textDecoration: `none`}}>{siteTitle}</a>
     
    </h3>
    <a className="navbar-brand" href="https://vk.com/id151078439">
      <img
        src="https://sun9-37.userapi.com/c317630/v317630439/76a0/Bz6QTfBog0I.jpg?ava=1"
        alt=""
        style={{
          verticalAlign: 'middle',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          filter: 'grayscale(100%)',
          objectFit: 'cover'
        }} />
    </a>
  </nav>

 
)


export default Header