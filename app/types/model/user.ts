import type firebase from 'firebase/app'

type UserBase = {
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

export type User = UserBase & { uid: string }
