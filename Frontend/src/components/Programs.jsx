import React from 'react'

const Programs = () => {
  return (
    <div className='app'>
     {/* Programs */}
      <section className="program-section" id="programs">
        <div className="program-content">
          <span>कार्यक्रम</span>

          <h2>
            आपके क्षेत्र में,
            <br />
            आपके साथ।
          </h2>

          <p>
            जनसंवाद, सदस्यता अभियान और सामाजिक कार्यक्रमों में हमारे साथ जुड़ें।
          </p>

          <a href="/events"><button className="join-btn">कार्यक्रम देखें →</button></a>
        </div>
      </section>
    </div>
  )
}

export default Programs
