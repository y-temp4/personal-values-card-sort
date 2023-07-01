import * as admin from 'firebase-admin'
const serviceAccountKey = require(`./serviceAccountKey.json`)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  // databaseURL: env.FIREBASE_DATABASE_URL,
})

const userEmails = [] as string[]

// @ts-ignore
async function listAllUsers(nextPageToken?: string) {
  await admin
    .auth()
    .listUsers(1000, nextPageToken)
    .then(async function (listUsersResult) {
      listUsersResult.users.forEach(function (userRecord) {
        const email = userRecord.email
        if (!email) return
        userEmails.push(email)
        console.log(`email: ${email}`)
      })
      if (listUsersResult.pageToken)
        await listAllUsers(listUsersResult.pageToken)
    })
    .catch(function (error) {
      console.log('Error listing users:', error)
    })
}

async function fetchAllAuthUsers() {
  const result: admin.auth.UserRecord[] = []
  // ユーザ一覧の取得は、1000件まで
  let listUsersResult = await admin.auth().listUsers(1000)
  result.push(...listUsersResult.users.filter((user) => !!user.email))

  console.log(!!listUsersResult.pageToken)

  // 1001件目以降は、pageTokenを利用して取得する
  while (!!listUsersResult.pageToken) {
    listUsersResult = await admin
      .auth()
      .listUsers(1000, listUsersResult.pageToken)
    result.push(...listUsersResult.users)
  }
  return result
}

async function run() {
  const users = await fetchAllAuthUsers()
  const uniqUsers = [...new Set(users.map((user) => user.email))]
  console.log(uniqUsers)
  console.log(uniqUsers.length)
  // await listAllUsers()
}

run()
