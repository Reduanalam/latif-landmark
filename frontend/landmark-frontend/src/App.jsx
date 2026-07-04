import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Properties from './components/Properties'
import PlotBooking from './components/PlotBooking'
import Stats from './components/Stats'
import Reviews from './components/Reviews'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Properties />
      <PlotBooking />
      <Stats />
      <Reviews />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
