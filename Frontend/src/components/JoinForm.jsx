import React from 'react'

const JoinForm = () => {
  return (
    <div>
      <h2>Join Our Team</h2>
      <form>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default JoinForm
