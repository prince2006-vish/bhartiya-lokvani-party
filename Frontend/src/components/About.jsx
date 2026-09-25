import React from 'react'

const About = () => {
  return (
    <div className='app'>
      {/* About */}
      <section className="about-section" id="about">
        <div className="section-heading">
          <span>हमारे बारे में</span>
          <h2>जनता के लिए, जनता के साथ</h2>
          <p>
            भारती लोक वाणी पार्टी का उद्देश्य लोकतांत्रिक मूल्यों, पारदर्शिता और
            जनभागीदारी को मजबूत करना है।
          </p>
        </div>

        <div className="about-grid">
          <div className="about-box"> 
            <div className="icon">01</div>
            <h3>जनभागीदारी</h3>
            <p>जनता की राय और सुझावों को निर्णय प्रक्रिया का हिस्सा बनाना।</p>
          </div>

          <div className="about-box">
            <div className="icon">02</div>
            <h3>पारदर्शिता</h3>
            <p>शासन और संगठन में जवाबदेही एवं पारदर्शिता को प्राथमिकता।</p>
          </div>

          <div className="about-box">
            <div className="icon">03</div>
            <h3>समान अवसर</h3>
            <p>प्रत्येक नागरिक को आगे बढ़ने के समान अवसर उपलब्ध कराना।</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About  
