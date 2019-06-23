// import React from 'react';
import React, { Component } from 'react'
import { compose } from 'recompose';
import {AuthUserContext, withAuthorization , withEmailVerification} from '../../Components/Session'
import { withFirebase } from '../Firebase';
import './home.css';
import Modal from 'react-responsive-modal';



const HomePage = () => (

 <div id = "entrance">

<div id = "banner">
<h3 className='logo-link-up-banner center'>Link up!</h3>
</div>



<div className = "home-box">
    
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
        like:0,
       
        
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
            console.log(this.state.text)
     
        
     };

     onCreateMessage = (event, authUser) => { 
         if(this.state.text === ''){
            alert("Empty message")

            }else{
                
                this.props.firebase.messages().push({ 
                    text: this.state.text, 
                    userId: authUser.uid,
                    userName :authUser.username,
                    photoURL:authUser.photoURL,
                    contador:parseInt(this.state.like),
                    createdAt: this.props.firebase.serverValue.TIMESTAMP });
            }

            this.setState({ text: '' })
            this.setState({ contador: 0 })

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
        const { text, messages, loading} = this.state  
    
    return ( 
        <AuthUserContext.Consumer> 
        {authUser => (
        <div>
        <form onSubmit={event => 

        this.onCreateMessage(event, authUser)        
        }>
        <input type="text" id = "post-form" placeholder="What's on your mind?" value={text} onChange={this.onChangeText} />  
       
        </form>
             
        {messages ? (
             <MessageList
             authUser={authUser}
              messages={messages} 
              onEditMessage={this.onEditMessage}
             onRemoveMessage={this.onRemoveMessage}
            //  sumar={this.sumar}
             
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

    
class MessageItem extends Component { 
    constructor(props) {
         super(props);
     this.state = { 
         editMode: false, 
         editText: this.props.message.text,
         contadorlike: parseInt(this.props.message.contador),
         open:false,
    };
    }  
    onToggleEditMode = () => { 
    this.setState(state => ({ 
    editMode: !state.editMode, 
    editText: this.props.message.text, 
}));
 }; 
 onChangeEditText = event => { 
     this.setState({ editText: event.target.value}); 
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

onChangeLike = event => { 
        this.setState({contadorlike: event.target.dataset.contadorlike + 1} );
    };

sumar = () => { this.setState( state =>
        ({ contadorlike: state.contadorlike + 1 }), 
       ); 
       };
       onOpenModal = () => {
        this.setState({ open: true });
      };
     
      onCloseModal = () => {
        this.setState({ open: false });
      };

 render() { 
     const { authUser, message, onRemoveMessage } = this.props; 
     const { editMode, editText,contadorlike, open } = this.state;
return ( 
    <li> 
        
        {editMode ? ( 
        
            <div className="card-content">
        <div className="col s12 m7">
            <div className="card horizontal card-box ">
                
                <div className="post-card">
                    <div className="post-img ">
                    
                    <img className="img-card" src={message.photoURL} alt=""></img>
                        <strong className="item-name"> {message.userName}</strong>
                        </div>
                        <div>
                    
                    <input type="text" value={editText}  onChange={this.onChangeEditText} /> 

                    </div>
                    <div className="post-likes">
                
                        <button className="waves-effect waves-light btn btn-like" type="button" data-contadorlike={contadorlike} onClick={this.sumar}> {contadorlike}</button>
                   
                        {message.editedAt && <span>(Edited)</span>}

                        </div>

                        </div> 

                    </div>  

                 </div>    
          </div> 
        ) : (
    <div className="card-content">
        <div className="col s12 m7">
            <div className="card horizontal card-box ">
                
                <div className="post-card">
                    <div className="post-img ">
                    <img className="img-card" src={message.photoURL} alt=""></img>
                        <strong className="item-name"> {message.userName}</strong>
                        </div>
                        <div>
                    <p align="justify">{message.text} </p>

                    </div>
                    <div className="post-likes">
                
                        <button className="waves-effect waves-light btn btn-like" type="button" data-contadorlike={contadorlike} onClick={this.sumar}> {contadorlike}</button>
                   
                        {message.editedAt && <span>(Edited)</span>}

                        </div>

                        </div> 

                    </div>  

                 </div>    
          </div>           


     )}
     {authUser.uid === message.userId && ( 
        <span>
        {editMode ?  (
            <span>
            <button className="waves-effect waves-light btn" onClick={this.onSaveEditText}>Save</button> 
            <button className="waves-effect waves-light btn" onClick={this.onToggleEditMode}>Reset</button>

            </span>
            

            
            ) : (
        <button className="waves-effect waves-light btn " onClick={this.onToggleEditMode}>EDIT</button>
        )}
        {!editMode && (
            <span>
                    <button className="waves-effect waves-light btn" onClick={this.onOpenModal}>Delete</button>
                    <Modal open={open} onClose={this.onCloseModal} center>
                        <h1>are you sure?</h1>
                    <button type="button" className="waves-effect waves-light btn margin-left"  onClick={() => onRemoveMessage(message.uid)} 
        > Delete 
        </button> 

                    </Modal>
                    </span>
        )} 
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