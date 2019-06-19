
// import React from 'react';
import React, { Component } from 'react'
import { compose } from 'recompose';
import {AuthUserContext, withAuthorization , withEmailVerification} from '../../Components/Session'
import { withFirebase } from '../Firebase';
import Navigation from '../Navigation';
import './home.css'


 
const HomePage = () => (

<div>

<section id = "topnav">

<Navigation/>
</section>

 


<div id =  "banner-user">

<h1>Link Up</h1>

<p>Sharing awesome ideas, help you grow.</p>

</div>
<div>
<Messages/>
</div>

</div>



);


class MessagesBase extends Component { 
    constructor(props) { 
        super(props);
    this.state = { 
        text: '',
        loading: false, 
        messages: [], 
        limit: 5,
    };
    }

    componentDidMount() { 
        this.onListenForMessages()
    }
    onListenForMessages() {
        this.setState({ loading: true })
        this.props.firebase
        .messages()
        .orderByChild('createdAt')
        .limitToLast(this.state.limit)

        .on('value', snapshot => { 
            const messageObject = snapshot.val()
            // convert messages list from snapshot
            if (messageObject) {
                const messageList = Object.keys(messageObject).map(key => ({ 
                    ...messageObject[key], uid: key, 
                }) 
            
                );
            this.setState({
                // Pus un reverse para revertir el orden de las publicaciones
                messages: messageList.reverse(),
                 loading: false,
                 })
        } else { 
            this.setState({ messages: null, loading: false });
        }
        });
    
    }
    componentWillUnmount() { 
        this.props.firebase.messages().off();
    }

    onChangeText = event => { 
        this.setState({ text: event.target.value });
     };
     onCreateMessage = (event, authUser) => { 
         this.props.firebase.messages().push({ 
             text: this.state.text, 
             userId: authUser.uid,
             userName :authUser.username,
             createdAt: this.props.firebase.serverValue.TIMESTAMP,
             photoURL: authUser.photoURL,
            });

            this.setState({ text: '' })

            event.preventDefault()
        };
        onRemoveMessage = uid => { 
            this.props.firebase.message(uid).remove(); 
        };
        onEditMessage = (message, text) => { 
            const { uid, ...messageSnapshot } = message;
this.props.firebase.message(message.uid).set({ 
    ...messageSnapshot, 
    text, 
    editedAt: this.props.firebase.serverValue.TIMESTAMP,
}); }
onNextPage = () => { this.setState( state =>
     ({ limit: state.limit + 5 }), 
     this.onListenForMessages, ); 
    };
    render(){
        const { text, messages, loading } = this.state  
    
    return ( 
        <AuthUserContext.Consumer> 
        {authUser => (
        <div>
            
            <form onSubmit={event => this.onCreateMessage(event, authUser)} id = "post-form">
        <input id = "post"
        type="text" 
        value={text}
        placeholder = "share your ideas..."
        onChange={this.onChangeText}/> 
       
        <div id = "extra-tools">
        <i class="material-icons">add_location</i>   
        <i class="material-icons">add_a_photo</i>
        <button type="submit" id = "post-btn" className = "waves-effect waves-light btn">Post</button> 
        
        </div>
        </form>
             
        {messages ? (
             <MessageList
             authUser={authUser}
              messages={messages} 
              onEditMessage={this.onEditMessage}
             onRemoveMessage={this.onRemoveMessage}
             /> 
             ) : (
            <div>There are no messages...</div>
                  )}
        {loading && <div>Loading ...</div>}
        {!loading && messages && 
                ( <button type="button" 
            onClick={this.onNextPage}> More </button> 
            )}

                  
        </div> 
        )}
        </AuthUserContext.Consumer>
    );
             }
            }


const MessageList = ({ authUser, messages, onEditMessage, onRemoveMessage }) => 
( <ul> 
    {messages.map(message => ( 
    <MessageItem 
    authUser={authUser}
    key={message.uid} 
    message={message} 
    onEditMessage={onEditMessage}
    onRemoveMessage={onRemoveMessage}
        />
     ))} 
     </ul> 
     );

    //  const MessageItem = ({ message, onRemoveMessage }) => (
    //       <li> 
    //     <strong>{message.userId}</strong> {message.text} 
    //     <button 
    //     type="button" 
    //     onClick={() => onRemoveMessage(message.uid)} >
    //          Delete 
    //          </button>
    //     </li> 
    //     );
    
class MessageItem extends Component { 
    constructor(props) {
         super(props);
     this.state = { 
         editMode: false, 
         editText: this.props.message.text, };
    }  
    onToggleEditMode = () => { 
    this.setState(state => ({ 
    editMode: !state.editMode, 
    editText: this.props.message.text, 
}));
 }; 
 onChangeEditText = event => { 
     this.setState({ editText: event.target.value 
    }); 
};


 onEditMessage = (message, text) => {
      const { uid, ...messageSnapshot } = message;
      this.props.firebase.message(message.uid).set({ 
          ...messageSnapshot, text, }); }

onSaveEditText = () => { 
       this.props.onEditMessage(this.props.message,  this.state.editText
                );
    this.setState({ editMode: false });
         }
 render() { 
     const { authUser, message, onRemoveMessage } = this.props; 
     const { editMode, editText } = this.state;
return ( 
    <li> 
        
        {editMode ? ( 
        <input type="text" 
        value={editText} 
        onChange={this.onChangeEditText} /> 
        ) : (
            
        <span> 
  
 <div id = "post-container">
         <div className ="row">
    <div className = "old-post-card">
      <div class="card blue-grey darken-1">
        <div class="card-content white-text">



          <span class="card-title"> <img src = {message.photoURL} id = "img-user" alt = "user"  width = "60hv"></img>   </span>
          <p> <strong>{message.userName}</strong> {message.text} 
        {message.editedAt && <span>(Edited)</span>}</p>

          
      {authUser.uid === message.userId && ( 
          <div className="card-action">
         <span>
         {editMode ?  (
             <span>
             <button onClick={this.onSaveEditText}>Save</button> 
             <button onClick={this.onToggleEditMode}>Reset</button>
             </span>
             ) : (
         <button onClick={this.onToggleEditMode}>Edit</button>
         )}
         {!editMode && (
         <button type="button"  onClick={() => onRemoveMessage(message.uid)} 
         > Delete 
         </button> 
         )} 
         </span>
         </div>
         )}
        </div>

      </div>
    </div>
  </div>
  </div>
  
  </span>
  )}
  
     </li> 
     );
}
}

        const Messages = withFirebase(MessagesBase)       

const condition = authUser => !!authUser

export default compose( 
    withEmailVerification, withAuthorization(condition),
)(HomePage)
