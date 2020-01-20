import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { message } from '../models/message';
import { firestore } from 'firebase' ;
import * as firebase from 'firebase';
//import { message } from '../models/message';
//import { room } from '../models/room';

export interface chat{
  description : string; 
  name : string ;
  id : string;
  img : string; 
  user:string;
}
export interface privatechat{
  description : string;
  name : string;
  id : string;
  img : string;
  password : string;
  user:string
}

@Injectable({
  providedIn: 'root'
})
export class ChatsService {


  constructor(private db : AngularFirestore) { }

  getChatRooms(){
    return this.db.collection('ChatsRooms').snapshotChanges().pipe(map(rooms =>{
      return rooms.map(a =>{
        const data = a.payload.doc.data() as chat;
        data.id = a.payload.doc.id;
        return data;
      })  
    }))
  }

  getPrivateChatRooms(){
    return this.db.collection('PrivateChatRooms').snapshotChanges().pipe(map(rooms =>{
      return rooms.map(a =>{
        const data = a.payload.doc.data() as privatechat;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }
  getprivateChatRoom(chat_id :string){
    return this.db.collection('PrivateChatRooms').doc(chat_id).valueChanges()  
  }

  getChatRoom( chat_id : string  ){
    return this.db.collection('ChatsRooms').doc(chat_id).valueChanges()
  }

 

  sendMsgToFirebase(message : message, chat_id : string,){
    this.db.collection('ChatsRooms').doc(chat_id).update({
      messages : firestore.FieldValue.arrayUnion(message),
    })
  }

  sendPrivateMsgToFirebase(message : message,chat_id:string){
    this.db.collection('PrivateChatRooms').doc(chat_id).update({
      message : firestore.FieldValue.arrayUnion(message),
    })
  }

  createChatRoom( nameChat:string, description:string,img:string,user:string){
   
    return this.db.collection('ChatsRooms').add({
      name:nameChat,
      description:description,
      url_img:img,
      userID:user
    });
  }
  createPrivateChatRoom( nameChat:string, description:string,img:string,user:string,password:string){
    return this.db.collection('PrivateChatRooms').add({
      name:nameChat,
      password:password,
      description:description,
      url_img:img,
      userID:user    
    });
  }
}
