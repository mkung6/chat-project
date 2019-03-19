import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import './App.css';
import Chat from './components/Chat';

class App extends Component {
  state = {
    author: '',
    entry: ''
  }

  componentDidMount() {
    const author = window.prompt("Enter a username");
    author && this.setState({ author });
    this.subscribeToNewMessages();
  }

  subscribeToNewMessages = () => {
    this.props.allMessagesQuery.subscribeToMore({
      document: gql`
        subscription MessageSentSubscription {
          messageSent {
            id
            author
            entry
          }
        }
      `,
      updateQuery: (previousData, { subscriptionData }) => {
        return {
          messages: [
            ...previousData.messages,
            subscriptionData.data.messageSent
          ]
        };
      }
    });
  }
  createMessage = async e => {
    if (e.key === 'Enter') {
      const { author, entry } = this.state;
      await this.props.createMessageMutation({
        variables: { author, entry }
      });
      this.setState({ entry: '' });
    }
  }

  render() {
    const allMessages = this.props.allMessagesQuery.messages || [];
    return (
      <div className="App">
        {allMessages.map(message => (
            <Chat
              key={message.id}
              message={message}
            />
        ))}
        <div className="messageInput">
          <input
            value={this.state.entry}
            type="text"
            placeholder="[ start typing ]"
            onChange={e => this.setState({ entry: e.target.value })}
            onKeyPress={this.createMessage}
          />
        </div>
      </div>
    );
  }
}

const ALL_MESSAGES_QUERY = gql`
  query AllMessagesQuery {
    messages {
      id
      author
      entry
    }
  }
`;

const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessageMutation($author: String!, $entry: String!) {
    createMessage(author: $author, entry: $entry) {
      author
      entry
    }
  }
`;

export default compose(
  graphql(ALL_MESSAGES_QUERY, { name: 'allMessagesQuery' }),
  graphql(CREATE_MESSAGE_MUTATION, { name: 'createMessageMutation' })
)(App);
