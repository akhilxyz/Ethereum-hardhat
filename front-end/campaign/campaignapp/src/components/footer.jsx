import React from 'react'

export default function Footer() {
    return (
        <footer className="container-fluid footer">
        <div className="container">
          <a style={{ fontSize: "14px", textDecoration: "none", float: "right" }}>© D-Campaign, 2021 All rights reserved.</a>
          <a href="#" target="_blank"><i className="fa fa-facebook" /></a>
          <a href="#" target="_blank"><i className="fa fa-twitter" /></a>
          <a href="#" target="_blank"><i className="fa fa-github" /></a>
          <a href="#" target="_blank"><i className="fa fa-dribbble" /></a>
          <a href="#" target="_blank"><i className="fa fa-codepen" /></a>
        </div>
      </footer>
    )
}
