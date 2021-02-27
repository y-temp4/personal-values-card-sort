import type firebase from 'firebase/app'

export type UserDocData = {
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

export type User = UserDocData & { uid: string; isAnonymous: boolean }
