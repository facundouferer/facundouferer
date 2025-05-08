import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faInstagram,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faSpotify } from "@fortawesome/free-brands-svg-icons/faSpotify";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Twitter",
      url: "https://twitter.com/facundouferer",
      icon: faTwitter,
    },
    {
      name: "Instagram",
      url: "https://instagram.com/facundouferer",
      icon: faInstagram,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/facundouferer/",
      icon: faLinkedin,
    },
    {
      name: "GitHub",
      url: "https://github.com/facundouferer",
      icon: faGithub,
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/show/2CiWuSGhYr70Nwlanpoqzx?si=2481072e1e7c449a",
      icon: faSpotify,
    },
    {
      name: "Email",
      url: "mailto: juanfacundouf@gmail.com",
      icon: faEnvelope,
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {currentYear} Facundo Uferer</p>
        <p className="text-sm flex items-center justify-center mt-2">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-50 hover:text-white mx-2"
            >
              <FontAwesomeIcon icon={link.icon} className="mr-1 w-5" />
            </a>
          ))}
        </p>
      </div>
    </footer>
  );
}
