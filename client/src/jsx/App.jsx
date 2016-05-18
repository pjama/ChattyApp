import io from "socket.io-client";
import React from "react";
import ReactDOM from "react-dom";

var socket = io.connect("ws://localhost:8080");

var ChatApp = React.createClass({

  getInitialState() {
    return {
      users: [],
      messages:[]
    };
  },

  componentDidMount() {
    socket.on("init", this._initialize);
    socket.on("send:message", this._messageRecieve);
  },

  _initialize(data) {
    var {users, name, messages} = data;
    console.log(data)
    this.setState({users, messages, user: name});
  },

  _messageRecieve(message) {
    var {messages} = this.state;
    messages.push(message);
    this.setState({messages});
  },

  handleMessageSubmit(message) {
    var {messages} = this.state;
    messages.push(message);
    this.setState({messages});
    socket.emit("send:message", message);
  },

  render() {
    return (
      <div>
        <MessageList
          messages={this.state.messages}
        />
        <MessageEntry/>
      </div>
    );
  }
});

var MessageList = React.createClass({
  render() {
    var messages = this.props.messages.map((message, i) => {
      return (
        <Message
          key={i}
          user={message.user}
          text={message.text}
        />
      );
    });
    return (
      <div className="message-list">
        <h2> Messages: </h2>
        { messages }
      </div>
    );
  }
});


var Message = React.createClass({
  render() {
    return (
      <div className="message">
        <strong>{this.props.user}: </strong>
        <span>{this.props.text}</span>
      </div>
    );
  }
});

var MessageEntry = React.createClass({
  render() {
    return (
      <div className="message-entry">
        <span>
          <input type="text" className="message-input-field"></input>
        </span>
        <span>
          <div className="message-send-btn">Send</div>
        </span>
      </div>
    )
  }
});

ReactDOM.render(<ChatApp/>, document.getElementById("app"));
