export const loginMutation = `
  mutation Login($email: String!, $password: String!) {
    Login(email: $email, password: $password) {
      token
      user {
        id
        fullName
        avatarImageUrl
        canCreate
      }
    }
  }
`
