import React from 'react';

const Chat = ({ message }) => (
  <div className="chat-box">
    <div className="chat-message">
      <h5>
        {message.author}
      </h5>
      <p>
        {message.entry}
      </p>
    </div>
  </div>
);

export default React.memo(Chat);
