import React from 'react';
import './Footer.css';
import Image from './Image';

export default function Footer(): React.JSX.Element {
  return (
    <footer className='footer'>
      <div className="footer-content">
        <div className="footer-logo">
          <Image src="./src/assets/ab.png" alt="Logo" />
          <p>Made in Design And Creation</p>
          <p className="footer-text">&copy; 2021 - {new Date().getFullYear()} ProxyBio-Line, Tous droits réservés.</p>
        </div>
        <ul className="footer-links">
          <li><a href="#about">À propos</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#privacy">Politique de confidentialité</a></li>
        </ul>
      </div>
    </footer>
  );
}