import { Link } from "@tanstack/react-router";
import { Code, Github, Mail, Twitter } from "lucide-react";

export default function Footer(){
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-8 w-8 text-indigo-400" />
                <span className="text-2xl font-bold">CodeMy</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500">
                Empowering developers through interactive learning and hands-on coding experiences.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
            <p>&copy; 2025 CodeMy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}