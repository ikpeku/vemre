import React from 'react';
import About from '@/components/components/About';
import AchievementCounter from '@/components/components/AchievementCounter';
import HeroHeader from '@/components/components/HeroHeader';
import OurService from '@/components/components/OurService';
import ScrollReveal from '@/components/components/ScrollReveal';
import Teams from '@/components/components/Teams';
import Faq from '@/components/components/Faq';
import ContactMe from '@/components/components/ContactMe';
import OurApp from '@/components/components/OurApp';
// import Navbar from './components/NavBar';
// import HeroHeader from './components/HeroHeader';
// import OurService from './components/OurService';
// import About from './components/About';
// import Teams from './components/Teams';
// import AchievementCounter from './components/AchievementCounter';
// import Faq from './components/Faq';
// import ContactMe from './components/ContactMe';
// import OurApp from './components/OurApp';
// import FooterComp from './components/FooterComp';
// import ScrollReveal from './components/ScrollReveal';

function App() {
  return (
    <div>

<HeroHeader />
<ScrollReveal><OurService /></ScrollReveal>
<ScrollReveal><About /></ScrollReveal>
<ScrollReveal><Teams /></ScrollReveal>
<ScrollReveal><AchievementCounter /></ScrollReveal>
<ScrollReveal><Faq /></ScrollReveal>
<ScrollReveal><ContactMe /></ScrollReveal>
<ScrollReveal><OurApp /></ScrollReveal>


    {/* 
    <Navbar />


   




    <ScrollReveal><FooterComp /></ScrollReveal> 
    // */}
  </div>
  );
}

export default App;