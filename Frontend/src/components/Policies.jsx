import React from 'react'

const Policies = () => {
  return (
    <div className='app'>
      {/* Policies */}
      <section className="policy-section" id="policies">
        <div className="section-heading">
          <span>हमारी नीतियाँ</span>
          <h2>विकास का स्पष्ट संकल्प</h2>
        </div>

        <div className="policy-grid">
          <div className="policy-card">
            <h3>शिक्षा</h3>
            <p>गुणवत्तापूर्ण एवं आधुनिक शिक्षा को बढ़ावा देना।</p>
            <a href="#">और जानें →</a>
          </div>

          <div className="policy-card">
            <h3>रोजगार</h3>
            <p>युवाओं के लिए रोजगार और कौशल विकास के अवसर।</p>
            <a href="#">और जानें →</a>
          </div>

          <div className="policy-card">
            <h3>किसान</h3>
            <p>किसानों की आय और सुविधाओं को मजबूत करने पर जोर।</p>
            <a href="#">और जानें →</a>
          </div>

          <div className="policy-card">
            <h3>महिला सशक्तिकरण</h3>
            <p>महिलाओं की सुरक्षा, शिक्षा और आर्थिक भागीदारी।</p>
            <a href="#">और जानें →</a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Policies
